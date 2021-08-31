"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const lambdaFunction_1 = require("../../lib/Lambda/lambdaFunction");
const constant_1 = require("../../utils/constant");
const ConstructsImports_1 = require("../../lib/ConstructsImports");
const SwaggerParser = require("@apidevtools/swagger-parser");
const model = require("../../../../model.json");
const _ = require("lodash");
const { lambdaStyle, apiType } = model.api;
if (apiType === constant_1.APITYPE.graphql) {
    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
        templating_1.Generator.generate({ outputFile: `${constant_1.PATH.lambda}main.ts` }, (output) => {
            const ts = new typescript_1.TypeScriptWriter(output);
            const lambda = new lambdaFunction_1.LambdaFunction(output);
            const imp = new ConstructsImports_1.Imports(output);
            for (var key in model.type.Query) {
                imp.importIndividualLambdaFunction(output, key, `./${key}`);
            }
            for (var key in model.type.Mutation) {
                imp.importIndividualLambdaFunction(output, key, `./${key}`);
            }
            imp.importAxios();
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
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        if (model.type.Mutation) {
            Object.keys(model.type.Mutation).forEach((key) => {
                templating_1.Generator.generate({ outputFile: `${constant_1.PATH.lambda}/${key}/${key}.ts` }, (writer) => {
                    const imp = new ConstructsImports_1.Imports(writer);
                    const lambda = new lambdaFunction_1.LambdaFunction(writer);
                    imp.importAxios();
                    lambda.initializeLambdaFunction(writer, lambdaStyle);
                });
            });
        }
        if (model.type.Query) {
            Object.keys(model.type.Query).forEach((key) => {
                templating_1.Generator.generate({ outputFile: `${constant_1.PATH.lambda}/${key}/${key}.ts` }, (writer) => {
                    const lambda = new lambdaFunction_1.LambdaFunction(writer);
                    const imp = new ConstructsImports_1.Imports(writer);
                    imp.importAxios();
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
            templating_1.Generator.generate({ outputFile: `${constant_1.PATH.lambda}main.ts` }, (output) => {
                const ts = new typescript_1.TypeScriptWriter(output);
                const lambda = new lambdaFunction_1.LambdaFunction(output);
                const imp = new ConstructsImports_1.Imports(output);
                imp.importAxios();
                /* import all lambda files */
                Object.keys(api.paths).forEach((path) => {
                    for (var methodName in api.paths[`${path}`]) {
                        let lambdaFunctionFile = api.paths[`${path}`][`${methodName}`][`operationId`];
                        imp.importIndividualLambdaFunction(output, lambdaFunctionFile, `${lambdaFunctionFile}`);
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
