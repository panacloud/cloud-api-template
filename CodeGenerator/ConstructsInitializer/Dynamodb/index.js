"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../../constant");
const Cdk_1 = require("../../../Constructs/Cdk");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const DynamoDB_1 = require("../../../Constructs/DynamoDB");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const { database } = model.api;
if (database && database === constant_1.DATABASE.dynamo) {
    templating_1.Generator.generate({
        outputFile: `${constant_1.PATH.construct}${constant_1.CONSTRUCTS.dynamodb}/index.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const { apiName, lambdaStyle, apiType } = model.api;
        let mutations = {};
        let queries = {};
        if (apiType === constant_1.APITYPE.graphql) {
            mutations = model.type.Mutation ? model.type.Mutation : {};
            queries = model.type.Query ? model.type.Query : {};
        }
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        const cdk = new Cdk_1.Cdk(output);
        const imp = new ConstructsImports_1.Imports(output);
        const dynamoDB = new DynamoDB_1.DynamoDB(output);
        imp.importsForStack(output);
        imp.importDynamodb(output);
        ts.writeLine();
        let props = [
            {
                name: `${apiName}_lambdaFn`,
                type: "lambda.Function",
            },
        ];
        if (lambdaStyle && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
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
        cdk.initializeConstruct(constant_1.CONSTRUCTS.dynamodb, undefined, () => {
            dynamoDB.initializeDynamodb(apiName, output);
            ts.writeLine();
            ts.writeLine(`this.table = ${apiName}_table`);
            ts.writeLine();
        }, output, undefined, properties);
    });
}
