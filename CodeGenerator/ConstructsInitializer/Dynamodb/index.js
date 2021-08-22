"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Cdk_1 = require("../../../Constructs/Cdk");
const DynamoDB_1 = require("../../../Constructs/DynamoDB");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const { database } = model.api;
if (database && database === cloud_api_constants_1.DATABASE.dynamo) {
    templating_1.Generator.generate({
        outputFile: `${cloud_api_constants_1.PATH.lib}${cloud_api_constants_1.CONSTRUCTS.dynamodb}/index.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const { apiName, lambdaStyle, apiType } = model.api;
        let mutations = {};
        let queries = {};
        if (apiType === cloud_api_constants_1.APITYPE.graphql) {
            mutations = model.type.Mutation ? model.type.Mutation : {};
            queries = model.type.Query ? model.type.Query : {};
        }
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        const cdk = new Cdk_1.Cdk(output);
        const dynamoDB = new DynamoDB_1.DynamoDB(output);
        cdk.importsForStack(output);
        dynamoDB.importDynamodb(output);
        ts.writeLine();
        let props = [
            {
                name: `${apiName}_lambdaFn`,
                type: "lambda.Function",
            },
        ];
        if (lambdaStyle && lambdaStyle === cloud_api_constants_1.LAMBDASTYLE.multi) {
            Object.keys(mutationsAndQueries).forEach((key, index) => {
                props[index] = {
                    name: `${apiName}_lambdaFn_${key}`,
                    type: "lambda.Function",
                };
            });
        }
        const properties = [
            {
                name: "table",
                typeName: "dynamodb.Table",
                accessModifier: "public",
                isReadonly: true,
            },
        ];
        cdk.initializeConstruct(cloud_api_constants_1.CONSTRUCTS.dynamodb, undefined, () => {
            dynamoDB.initializeDynamodb(apiName, output);
            ts.writeLine();
            functions_1.dynamodbAccessHandler(apiName, output);
            ts.writeLine();
        }, output, undefined, properties);
    });
}
