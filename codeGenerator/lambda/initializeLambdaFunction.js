"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { lambdaStyle } = model.api;
if (lambdaStyle === "single") {
    templating_1.Generator.generateFromModel({ outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/main.ts` }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const lambda = new lambdaFunction_1.LambdaFunction(output);
        for (var key in model.type.Query) {
            lambda.importIndividualFunction(output, key, `./${key}`);
        }
        for (var key in model.type.Mutation) {
            lambda.importIndividualFunction(output, key, `./${key}`);
        }
        ts.writeLine();
        ts.writeLineIndented(`
      type Event = {
          info: {
            fieldName: string
         }
       }`);
        ts.writeLine();
        lambda.initializeLambdaFunction(output, lambdaStyle, () => {
            for (var key in model.type.Query) {
                ts.writeLineIndented(`
            case "${key}":
                return await ${key}();
            `);
            }
            for (var key in model.type.Mutation) {
                ts.writeLineIndented(`
            case "${key}":
                return await ${key}();
            `);
            }
        });
    });
}
else if (lambdaStyle === "multiple") {
    if (model.type.Mutation) {
        Object.keys(model.type.Mutation).forEach((key) => {
            templating_1.Generator.generate({
                outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts`,
            }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.initializeLambdaFunction(writer, lambdaStyle);
            });
        });
    }
    if (model.type.Query) {
        Object.keys(model.type.Query).forEach((key) => {
            templating_1.Generator.generate({
                outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts`,
            }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.initializeLambdaFunction(writer, lambdaStyle);
            });
        });
    }
}
