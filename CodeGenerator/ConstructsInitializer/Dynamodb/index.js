"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Cdk_1 = require("../../../Constructs/Cdk");
const DynamoDB_1 = require("../../../Constructs/DynamoDB");
const Lambda_1 = require("../../../Constructs/Lambda");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const { database } = model.api;
if (database && database === cloud_api_constants_1.DATABASE.dynamoDb) {
    templating_1.Generator.generateFromModel({
        outputFile: `../../../../../lib/${cloud_api_constants_1.CONSTRUCTS.dynamodb}/index.ts`,
    }, (output, model) => {
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
        const lambda = new Lambda_1.Lambda(output);
        cdk.importsForStack(output);
        lambda.importLambda(output);
        dynamoDB.importDynamodb(output);
        ts.writeLine();
        let props = [
            {
                name: `${apiName}_lambdaFn`,
                type: "lambda.Function",
            },
        ];
        if (lambdaStyle && lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
            Object.keys(mutationsAndQueries).forEach((key, index) => {
                props[index] = {
                    name: `${apiName}_lambdaFn_${key}`,
                    type: "lambda.Function",
                };
            });
        }
        const properties = [
            {
                name: "tableName",
                typeName: "string",
                accessModifier: "public",
                isReadonly: true,
            },
        ];
        cdk.initializeConstruct(cloud_api_constants_1.CONSTRUCTS.dynamodb, "dbProps", () => {
            dynamoDB.initializeDynamodb(apiName, output);
            ts.writeLine();
            functions_1.dynamodbAccessHandler(apiName, output);
            ts.writeLine();
        }, output, props, properties);
    });
}
