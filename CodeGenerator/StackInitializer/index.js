"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const ApiManager_1 = require("../../Constructs/ApiManager");
const Cdk_1 = require("../../Constructs/Cdk");
const DynamoDB_1 = require("../../Constructs/DynamoDB");
const functions_1 = require("./functions");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const _ = require("lodash");
templating_1.Generator.generate({
    outputFile: `${cloud_api_constants_1.PATH.lib}${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const { apiName, lambdaStyle, database, apiType } = model.api;
    let mutations = {};
    let queries = {};
    if (apiType === cloud_api_constants_1.APITYPE.graphql) {
        mutations = model.type.Mutation ? model.type.Mutation : {};
        queries = model.type.Query ? model.type.Query : {};
    }
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    const cdk = new Cdk_1.Cdk(output);
    const dynamodb = new DynamoDB_1.DynamoDB(output);
    const manager = new ApiManager_1.apiManager(output);
    cdk.importsForStack(output);
    manager.importApiManager(output);
    if (apiType === cloud_api_constants_1.APITYPE.graphql) {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.appsync}`, [cloud_api_constants_1.CONSTRUCTS.appsync]);
    }
    else {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.apigateway}`, [cloud_api_constants_1.CONSTRUCTS.apigateway]);
    }
    ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.lambda}`, [cloud_api_constants_1.CONSTRUCTS.lambda]);
    if (database === cloud_api_constants_1.DATABASE.dynamo) {
        cdk.importForDynamodbConstruct(output);
    }
    if (database === cloud_api_constants_1.DATABASE.neptune) {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.neptuneDb}`, [cloud_api_constants_1.CONSTRUCTS.neptuneDb]);
    }
    if (database === cloud_api_constants_1.DATABASE.aurora) {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.auroradb}`, [cloud_api_constants_1.CONSTRUCTS.auroradb]);
    }
    ts.writeLine();
    cdk.initializeStack(`${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}`, () => {
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        if (database == cloud_api_constants_1.DATABASE.dynamo) {
            ts.writeLine(`const ${apiName}Lambda = new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}_table = new ${cloud_api_constants_1.CONSTRUCTS.dynamodb}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.dynamodb}",{`);
            functions_1.propsHandlerForDynamoDbConstruct(output, apiName, lambdaStyle, mutationsAndQueries);
            ts.writeLine("})");
            functions_1.lambdaEnvHandler(output, apiName, lambdaStyle, mutationsAndQueries);
            if (apiType === cloud_api_constants_1.APITYPE.graphql) {
                ts.writeLine(`const ${apiName} = new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
                functions_1.propsHandlerForAppsyncConstructDynamodb(output, apiName, lambdaStyle, mutationsAndQueries);
                ts.writeLine("})");
            }
        }
        else if (database == cloud_api_constants_1.DATABASE.neptune) {
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
        else if (database == cloud_api_constants_1.DATABASE.aurora) {
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
