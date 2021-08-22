"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const lambdaFunction_1 = require("../../Constructs/Lambda/lambdaFunction");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const SwaggerParser = require("@apidevtools/swagger-parser");
const model = require(`../../model.json`);
const { lambdaStyle, apiType } = model.api;
if (apiType === cloud_api_constants_1.APITYPE.graphql) {
    if (lambdaStyle === cloud_api_constants_1.LAMBDASTYLE.single) {
        if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
            Object.keys(model.type.Query).forEach((key) => {
                templating_1.Generator.generate({
                    outputFile: `${cloud_api_constants_1.PATH.lambda}${key}.ts`,
                }, (writer) => {
                    const lambda = new lambdaFunction_1.LambdaFunction(writer);
                    lambda.helloWorldFunction(key);
                });
            });
        }
        if (model.type.Mutation) {
            Object.keys(model.type.Mutation).forEach((key) => {
                templating_1.Generator.generate({
                    outputFile: `${cloud_api_constants_1.PATH.lambda}${key}.ts`,
                }, (writer) => {
                    const lambda = new lambdaFunction_1.LambdaFunction(writer);
                    lambda.helloWorldFunction(key);
                });
            });
        }
    }
}
else {
    SwaggerParser.validate(model.openApiDef, (err, api) => {
        if (err) {
            console.error(err);
        }
        else {
            Object.keys(api.paths).forEach((path) => {
                for (var methodName in api.paths[`${path}`]) {
                    let lambdaFunctionFile = api.paths[`${path}`][`${methodName}`][`operationId`];
                    templating_1.Generator.generate({
                        outputFile: `${cloud_api_constants_1.PATH.lambda}${lambdaFunctionFile}.ts`,
                    }, (writer) => {
                        const lambda = new lambdaFunction_1.LambdaFunction(writer);
                        lambda.helloWorldFunction(lambdaFunctionFile);
                    });
                }
            });
        }
    });
}
