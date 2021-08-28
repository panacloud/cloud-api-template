"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFunction = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../constant");
const model = require("../../model.json");
const { apiType } = model.api;
class LambdaFunction extends core_1.CodeWriter {
    initializeLambdaFunction(output, lambdaStyle, content) {
        const ts = new typescript_1.TypeScriptWriter(output);
        if (apiType === constant_1.APITYPE.graphql) {
            if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                ts.writeLineIndented(`
      var AWS = require('aws-sdk');
      
      exports.handler = async() => {
        // write your code here
        const data = await axios.post(http://sandbox:8080, event)
      }
      `);
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                ts.writeLine(`exports.handler = async (event:Event) => {`);
                ts.writeLine(`const data = await axios.post(http://sandbox:8080, event)`);
                ts.writeLine();
                ts.writeLine(`switch (event.info.fieldName) {`);
                ts.writeLine();
                content();
                ts.writeLine();
                ts.writeLine(`}`);
                ts.writeLine(`}`);
            }
        }
        else {
            /* rest api */
            ts.writeLine(`exports.handler = async (event: any) => {`);
            ts.writeLine(`const data = await axios.post(http://sandbox:8080, event)`);
            ts.writeLine(`try {`);
            ts.writeLine();
            ts.writeLine("const method = event.httpMethod;");
            ts.writeLine("const requestName = event.path.startsWith('/') ? event.path.substring(1) : event.path;");
            ts.writeLine("const body = JSON.parse(event.body);");
            content();
            ts.writeLine();
            ts.writeLine(`}`);
            ts.writeLine("catch(err) {");
            ts.writeLine("return err;");
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
