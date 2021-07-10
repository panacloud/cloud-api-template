"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Lambda extends core_1.CodeWriter {
    initializeLambda(name) {
        this
            .writeLineIndented(` const lambdaFn = new lambda.Function(this, "${name}", {
        functionName: "${name}",
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: "main.handler",
        code: lambda.Code.fromAsset("lambda-fns"),
        memorySize: 1024,
      });`);
    }
    importLambda(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("@aws-cdk/aws-lambda", "lambda");
    }
    addEnvironment(name, value) {
        this.writeLine(`lambdaFn.addEnvironment("${name}", ${value});`);
    }
}
exports.Lambda = Lambda;
