"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const lambdaFunction_1 = require("../../Constructs/Lambda/lambdaFunction");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const SwaggerParser = require("@apidevtools/swagger-parser");
const model = require("../../model.json");
const _ = require("lodash");
const { lambdaStyle, apiType } = model.api;
if (apiType === cloud_api_constants_1.APITYPE.graphql) {
    if (lambdaStyle === cloud_api_constants_1.LAMBDASTYLE.single) {
        templating_1.Generator.generateFromModel({ outputFile: `${cloud_api_constants_1.PATH.lambda}main.ts` }, (output, model) => {
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
    else if (lambdaStyle === cloud_api_constants_1.LAMBDASTYLE.multi) {
        if (model.type.Mutation) {
            Object.keys(model.type.Mutation).forEach((key) => {
                templating_1.Generator.generate({ outputFile: `${cloud_api_constants_1.PATH.lambda}${key}.ts` }, (writer) => {
                    const lambda = new lambdaFunction_1.LambdaFunction(writer);
                    lambda.initializeLambdaFunction(writer, lambdaStyle);
                });
            });
        }
        if (model.type.Query) {
            Object.keys(model.type.Query).forEach((key) => {
                templating_1.Generator.generate({ outputFile: `${cloud_api_constants_1.PATH.lambda}${key}.ts` }, (writer) => {
                    const lambda = new lambdaFunction_1.LambdaFunction(writer);
                    lambda.initializeLambdaFunction(writer, lambdaStyle);
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
            templating_1.Generator.generate({ outputFile: `${cloud_api_constants_1.PATH.lambda}main.ts` }, (output) => {
                const ts = new typescript_1.TypeScriptWriter(output);
                const lambda = new lambdaFunction_1.LambdaFunction(output);
                /* import all lambda files */
                Object.keys(api.paths).forEach((path) => {
                    for (var methodName in api.paths[`${path}`]) {
                        let lambdaFunctionFile = api.paths[`${path}`][`${methodName}`][`operationId`];
                        lambda.importIndividualFunction(output, lambdaFunctionFile, `./${lambdaFunctionFile}`);
                    }
                });
                ts.writeLine();
                let isFirstIf = true;
                lambda.initializeLambdaFunction(output, lambdaStyle, () => {
                    Object.keys(api.paths).forEach((path) => {
                        for (var methodName in api.paths[`${path}`]) {
                            let lambdaFunctionFile = api.paths[`${path}`][`${methodName}`][`operationId`];
                            isFirstIf
                                ? ts.writeLineIndented(`
                  if (method === "${_.upperCase(methodName)}" && requestName === "${path.substring(1)}") {
                    return await ${lambdaFunctionFile}();
                  }
                `)
                                : ts.writeLineIndented(`
                  else if (method === "${_.upperCase(methodName)}" && requestName === "${path.substring(1)}") {
                    return await ${lambdaFunctionFile}();
                  }
                `);
                            isFirstIf = false;
                        }
                    });
                });
            });
        }
    });
}
