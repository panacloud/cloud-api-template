"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const model = require("../../model.json");
const { lambdaStyle } = model.api;
if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
    templating_1.Generator.generateFromModel({ outputFile: `../../../../lambda-fns/main.ts` }, (output, model) => {
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
else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
    if (model.type.Mutation) {
        Object.keys(model.type.Mutation).forEach((key) => {
            templating_1.Generator.generate({ outputFile: `../../../../lambda-fns/${key}.ts` }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.initializeLambdaFunction(writer, lambdaStyle);
            });
        });
    }
    if (model.type.Query) {
        Object.keys(model.type.Query).forEach((key) => {
            templating_1.Generator.generate({ outputFile: `../../../../lambda-fns/${key}.ts` }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.initializeLambdaFunction(writer, lambdaStyle);
            });
        });
    }
}
