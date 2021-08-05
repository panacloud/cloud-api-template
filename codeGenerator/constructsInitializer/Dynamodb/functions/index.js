"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamodbPropsHandler = exports.dynamodbAccessHandler = void 0;
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../../cloud-api-constants");
const DynamoDB_1 = require("../../../../Constructs/DynamoDB");
const model = require("../../../../model.json");
const { lambdaStyle } = model.api;
const mutations = model.type.Mutation ? model.type.Mutation : {};
const queries = model.type.Query ? model.type.Query : {};
const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
const dynamodbAccessHandler = (apiName, output) => {
    const dynamoDB = new DynamoDB_1.DynamoDB(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle);
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle, key);
            ts.writeLine();
        });
    }
};
exports.dynamodbAccessHandler = dynamodbAccessHandler;
const dynamodbPropsHandler = (apiName, output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle && lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        const props = {
            name: `${apiName}_lambdaFn`,
            type: "lambda.Function",
        };
    }
    if (lambdaStyle && lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            const props = {
                name: `${apiName}_lambdaFn_${key}`,
                type: "lambda.Function",
            };
            ts.writeLine(`${props}`);
        });
    }
};
exports.dynamodbPropsHandler = dynamodbPropsHandler;