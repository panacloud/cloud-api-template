"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFunction = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
class LambdaFunction extends core_1.CodeWriter {
    initializeLambdaFunction(output, lambdaStyle, content) {
        const ts = new typescript_1.TypeScriptWriter(output);
        if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
            ts.writeLineIndented(`
      var AWS = require('aws-sdk');
      
      exports.handler = async() => {
        // write your code here
      }
      `);
        }
        else if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
           ts.writeLine(`exports.handler = async (event:Event) => {`);
            ts.writeLine(`switch (event.info.fieldName) {`);
            ts.writeLine();
            content();
            ts.writeLine();
            ts.writeLine(`}`);
            ts.writeLine(`}`);
        }
    }
    importIndividualFunction(output, name, path) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(path, [name]);
    }
    helloWorldFunction(name) {
        this.writeLineIndented(`
    const AWS = require('aws-sdk');
    
    export const ${name} = async() => {
      // write your code here
    }
    `);
    }
}
exports.LambdaFunction = LambdaFunction;
