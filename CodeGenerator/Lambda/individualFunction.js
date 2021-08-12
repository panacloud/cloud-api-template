"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const lambdaFunction_1 = require("../../Constructs/Lambda/lambdaFunction");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const SwaggerParser = require('@apidevtools/swagger-parser');
const jsonObj = require(`../../model.json`);
const { lambdaStyle, apiType } = jsonObj.api;
if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
    if (apiType === cloud_api_constants_1.APITYPE.graphql) {
        if ((_a = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.type) === null || _a === void 0 ? void 0 : _a.Query) {
            Object.keys(jsonObj.type.Query).forEach((key) => {
                templating_1.Generator.generate({
                    outputFile: `../../../../lambda-fns/${key}.ts`,
                }, (writer) => {
                    const lambda = new lambdaFunction_1.LambdaFunction(writer);
                    lambda.helloWorldFunction(key);
                });
            });
        }
        if (jsonObj.type.Mutation) {
            Object.keys(jsonObj.type.Mutation).forEach((key) => {
                templating_1.Generator.generate({
                    outputFile: `../../../../lambda-fns/${key}.ts`,
                }, (writer) => {
                    const lambda = new lambdaFunction_1.LambdaFunction(writer);
                    lambda.helloWorldFunction(key);
                });
            });
        }
    }
    else {
        SwaggerParser.validate(JSON.parse(jsonObj.openApiDef), (err, api) => {
            if (err) {
                console.error(err);
            }
            else {
                Object.keys(api.paths).forEach((path, i) => {
                    console.log("PathName => ", path);
                    Object.keys(api.paths[path]).forEach((methodName) => {
                        console.log("Lambda file name => ", api.paths.path.methodName.operationId);
                        api.paths.path.methodName.parameters.forEach((param) => {
                            console.log("InputParam => ", param.name);
                        });
                    });
                });
            }
        });
    }
}
