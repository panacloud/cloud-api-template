"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Cdk_1 = require("../../../Constructs/Cdk");
const DynamoDB_1 = require("../../../Constructs/DynamoDB");
const model = require("../../../model.json");
const { database } = model.api;
if (database && database === cloud_api_constants_1.DATABASE.dynamoDb) {
    templating_1.Generator.generateFromModel({
        outputFile: `../../../../../lib/${cloud_api_constants_1.CONSTRUCTS.dynamodb}/index.ts`,
    }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const { apiName } = model.api;
        const cdk = new Cdk_1.Cdk(output);
        const dynamoDB = new DynamoDB_1.DynamoDB(output);
        cdk.importsForStack(output);
        dynamoDB.importDynamodb(output);
        ts.writeLine();
        const properties = [
            {
                name: "table",
                typeName: "dynamodb.Table",
                accessModifier: "public",
                isReadonly: true,
            }
        ];
        cdk.initializeConstruct(cloud_api_constants_1.CONSTRUCTS.dynamodb, undefined, () => {
            dynamoDB.initializeDynamodb(apiName, output);
            ts.writeLine();
            ts.writeLine(`this.table = ${apiName}_table`);
        }, output, undefined, properties);
    });
}
