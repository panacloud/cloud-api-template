"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY } = jsonObj;
const { lambdaStyle } = jsonObj.api;
if (lambdaStyle === "single") {
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
