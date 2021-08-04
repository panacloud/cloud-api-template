"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandlerForDynamodb = void 0;
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../../cloud-api-constants");
const Lambda_1 = require("../../../../Constructs/Lambda");
const model = require("../../../../model.json");
const { apiName, lambdaStyle, database } = model.api;
const mutations = model.type.Mutation ? model.type.Mutation : {};
const queries = model.type.Query ? model.type.Query : {};
const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
const lambdaHandlerForDynamodb = (output) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
            lambda.initializeLambda(apiName, output, lambdaStyle, undefined, undefined, undefined);
            ts.writeLine();
            ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
        }
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
            Object.keys(mutationsAndQueries).forEach((key) => {
                lambda.initializeLambda(apiName, output, lambdaStyle, key, undefined, undefined);
                ts.writeLine();
                ts.writeLine(`this.${apiName}_lambdaFn_${key} = ${apiName}_lambdaFn_${key}`);
                ts.writeLine();
            });
        }
    }
    else {
        ts.writeLine("lambda not found");
    }
};
exports.lambdaHandlerForDynamodb = lambdaHandlerForDynamodb;
