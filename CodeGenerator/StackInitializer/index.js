"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const ApiManager_1 = require("../../Constructs/ApiManager");
const Appsync_1 = require("../../Constructs/Appsync");
const Cdk_1 = require("../../Constructs/Cdk");
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
    const appsync = new Appsync_1.Appsync(output);
    const cdk = new Cdk_1.Cdk(output);
    const manager = new ApiManager_1.apiManager(output);
    const { apiName, lambdaStyle, database, apiType } = model.api;
    cdk.importsForStack(output);
    manager.importApiManager(output);
    if (apiType === cloud_api_constants_1.APITYPE.graphql) {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.appsync}`, [cloud_api_constants_1.CONSTRUCTS.appsync]);
    }
    else {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.apigateway}`, [cloud_api_constants_1.CONSTRUCTS.apigateway]);
    }
    ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.lambda}`, [cloud_api_constants_1.CONSTRUCTS.lambda]);
    if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.dynamodb}`, [cloud_api_constants_1.CONSTRUCTS.dynamodb]);
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
            ts.writeLine(`const ${apiName}Lambda = new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}_table = new ${cloud_api_constants_1.CONSTRUCTS.dynamodb}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.dynamodb}",{`);
            functions_1.propsHandlerForDynoDbConstruct(output, apiName, lambdaStyle, mutationsAndQueries);
            ts.writeLine("})");
            functions_1.lambdaEnvHandler(output, apiName, lambdaStyle, mutationsAndQueries);
            if (apiType === cloud_api_constants_1.APITYPE.graphql) {
                ts.writeLine(`const ${apiName} = new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
                functions_1.propsHandlerForAppsyncConstructDynamodb(output, apiName, lambdaStyle, mutationsAndQueries);
                ts.writeLine("})");
            }
        }
        else if (database == cloud_api_constants_1.DATABASE.neptuneDb) {
            ts.writeLine(`const ${apiName}_neptunedb = new ${cloud_api_constants_1.CONSTRUCTS.neptuneDb}(this,"VpcNeptuneConstruct");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}Lambda = new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
            functions_1.lambdaConstructPropsHandlerNeptunedb(output, apiName);
            ts.writeLine("})");
            ts.writeLine();
            if (apiType === cloud_api_constants_1.APITYPE.graphql) {
                ts.writeLine(`const ${apiName} = new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
                functions_1.propsHandlerForAppsyncConstructNeptunedb(output, apiName, lambdaStyle, mutationsAndQueries);
                ts.writeLine("})");
            }
            ts.writeLine();
        }
        else if (database == cloud_api_constants_1.DATABASE.auroraDb) {
            ts.writeLine(`const ${apiName}_auroradb = new ${cloud_api_constants_1.CONSTRUCTS.auroradb}(this,"${cloud_api_constants_1.CONSTRUCTS.auroradb}");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}Lambda = new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
            functions_1.lambdaConstructPropsHandlerAuroradb(output, apiName);
            ts.writeLine("})");
            ts.writeLine();
            if (apiType === cloud_api_constants_1.APITYPE.graphql) {
                ts.writeLine(`const ${apiName} = new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
                functions_1.propsHandlerForAppsyncConstructNeptunedb(output, apiName, lambdaStyle, mutationsAndQueries);
                ts.writeLine("})");
            }
            ts.writeLine();
        }
        if (apiType === cloud_api_constants_1.APITYPE.rest) {
            ts.writeLine(`const ${apiName} = new ${cloud_api_constants_1.CONSTRUCTS.apigateway}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.apigateway}",{`);
            functions_1.propsHandlerForApiGatewayConstruct(output, apiName);
            ts.writeLine("})");
        }
    }, output);
});
