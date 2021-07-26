"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Lambda extends core_1.CodeWriter {
    importLambda(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_lambda as lambda"]);
    }
    initializeLambda(apiName, output, lambdaStyle, functionName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        if (lambdaStyle === "single lambda") {
            ts.writeVariableDeclaration({
                name: `${apiName}_lambdaFn`,
                typeName: "lambda.Function",
                initializer: () => {
                    ts.writeLine(`new lambda.Function(this, "${apiName}Lambda", {
          functionName: "${apiName}Lambda",
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: "main.handler",
          code: lambda.Code.fromAsset("lambda-fns"),
          memorySize: 1024,
        });`);
                },
            }, "const");
        }
        else if (lambdaStyle === "multiple lambda") {
            ts.writeVariableDeclaration({
                name: `${apiName}_lambdaFn_${functionName}`,
                typeName: "lambda.Function",
                initializer: () => {
                    ts.writeLine(`new lambda.Function(this, "${apiName}Lambda${functionName}", {
          functionName: "${apiName}Lambda${functionName}",
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: "${functionName}.handler",
          code: lambda.Code.fromAsset("lambda-fns"),
          memorySize: 1024,
        });`);
                },
            }, "const");
        }
    }
    addEnvironment(lambda, envName, value, lambdaStyle, functionName) {
        if (lambdaStyle === "single lambda") {
            this.writeLine(`${lambda}_lambdaFn.addEnvironment("${envName}", ${value});`);
        }
        else if (lambdaStyle === "multiple lambda") {
            this.writeLine(`${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`);
        }
    }
}
exports.Lambda = Lambda;
