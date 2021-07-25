"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFunction = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class LambdaFunction extends core_1.CodeWriter {
    initializeLambdaFunction(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLineIndented(`
    const AWS = require('aws-sdk');
    
    exports.handler = async() => {
      // write your code here
    }
    `);
    }
}
exports.LambdaFunction = LambdaFunction;
