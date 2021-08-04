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
        outputFile: `../../../../../lib/Dynamodb/index.ts`,
    }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const { apiName, lambdaStyle, database } = model.api;
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        const cdk = new Cdk_1.Cdk(output);
        const dynamoDB = new DynamoDB_1.DynamoDB(output);
        const lambda = new Lambda_1.Lambda(output);
        cdk.importsForStack(output);
        lambda.importLambda(output);
        dynamoDB.importDynamodb(output);
        ts.writeLine();
        const dbProps = functions_1.dynamodbPropsHandler();
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
            functions_1.dynamodbAccessHandler(output);
            ts.writeLine();
        }, output, dbProps, properties);
    });
}
