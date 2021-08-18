"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const ApiManager_1 = require("../../Constructs/ApiManager");
const Cdk_1 = require("../../Constructs/Cdk");
const DynamoDB_1 = require("../../Constructs/DynamoDB");
const functions_1 = require("./functions");
const jsonObj = require("../../model.json");
const { USER_WORKING_DIRECTORY } = jsonObj;
const fs = require("fs");
const _ = require("lodash");
templating_1.Generator.generateFromModel({
    outputFile: `../../../../lib/${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const mutations = model.type.Mutation ? model.type.Mutation : {};
    const queries = model.type.Query ? model.type.Query : {};
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    const cdk = new Cdk_1.Cdk(output);
    const dynamodb = new DynamoDB_1.DynamoDB(output);
    const manager = new ApiManager_1.apiManager(output);
    const { apiName, lambdaStyle, database } = model.api;
    cdk.importsForStack(output);
    manager.importApiManager(output);
    cdk.importForAppsyncConstruct(output);
    if (lambdaStyle) {
        cdk.importForLambdaConstruct(output);
    }
    if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
        cdk.importForDynamodbConstruct(output);
    }
    if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.neptuneDb}`, [cloud_api_constants_1.CONSTRUCTS.neptuneDb]);
    }
    if (database === cloud_api_constants_1.DATABASE.auroraDb) {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.auroradb}`, [cloud_api_constants_1.CONSTRUCTS.auroradb]);
    }
    ts.writeLine();
    cdk.initializeStack(`${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}`, () => {
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        if (database == cloud_api_constants_1.DATABASE.dynamoDb) {
            ts.writeVariableDeclaration({
                name: `${apiName}_table`,
                typeName: cloud_api_constants_1.CONSTRUCTS.dynamodb,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.dynamodb}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.dynamodb}")`);
                }
            }, "const");
            ts.writeLine();
            ts.writeVariableDeclaration({
                name: `${apiName}Lambda`,
                typeName: cloud_api_constants_1.CONSTRUCTS.lambda,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
                    functions_1.lambdaPropsHandlerDynamodb(output, `${apiName}_table`);
                    ts.writeLine("})");
                }
            }, "const");
            ts.writeLine();
            functions_1.LambdaAccessHandler(output, apiName, lambdaStyle, mutationsAndQueries);
            ts.writeLine();
            ts.writeVariableDeclaration({
                name: `${apiName}`,
                typeName: cloud_api_constants_1.CONSTRUCTS.appsync,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
                    functions_1.propsHandlerForAppsyncConstructDynamodb(output, apiName, lambdaStyle, mutationsAndQueries);
                    ts.writeLine("})");
                }
            }, "const");
        }
        if (database == cloud_api_constants_1.DATABASE.neptuneDb) {
            ts.writeLine(`const ${apiName}_neptunedb = new ${cloud_api_constants_1.CONSTRUCTS.neptuneDb}(this,"VpcNeptuneConstruct");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}Lambda = new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
            functions_1.lambdaConstructPropsHandlerNeptunedb(output, apiName);
            ts.writeLine("})");
            ts.writeLine();
            ts.writeLine(`const ${apiName} = new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
            functions_1.propsHandlerForAppsyncConstructNeptunedb(output, apiName, lambdaStyle, mutationsAndQueries);
            ts.writeLine("})");
            ts.writeLine();
        }
        if (database == cloud_api_constants_1.DATABASE.auroraDb) {
            ts.writeLine(`const ${apiName}_auroradb = new ${cloud_api_constants_1.CONSTRUCTS.auroradb}(this,"${cloud_api_constants_1.CONSTRUCTS.auroradb}");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}Lambda = new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
            functions_1.lambdaConstructPropsHandlerAuroradb(output, apiName);
            ts.writeLine("})");
            ts.writeLine();
            ts.writeLine(`const ${apiName} = new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
            functions_1.propsHandlerForAppsyncConstructNeptunedb(output, apiName, lambdaStyle, mutationsAndQueries);
            ts.writeLine("})");
            ts.writeLine();
        }
    }, output);
});
