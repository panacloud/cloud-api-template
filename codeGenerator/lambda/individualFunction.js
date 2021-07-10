"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY } = jsonObj;
Object.keys(jsonObj.type.Query).forEach((key) => {
    templating_1.Generator.generate({ outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts` }, (writer) => {
        const lambda = new lambdaFunction_1.LambdaFunction(writer);
        lambda.helloWorldFunction(key);
    });
});
Object.keys(jsonObj.type.Mutation).forEach((key) => {
    templating_1.Generator.generate({ outputFile: `${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts` }, (writer) => {
        const lambda = new lambdaFunction_1.LambdaFunction(writer);
        lambda.helloWorldFunction(key);
    });
});
