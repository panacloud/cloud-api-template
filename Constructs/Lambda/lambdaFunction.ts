import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { APITYPE, LAMBDA } from "../../cloud-api-constants";
const model = require("../../model.json")
const { apiType } = model.api;
export class LambdaFunction extends CodeWriter {
  public initializeLambdaFunction(
    output: TextWriter,
    lambdaStyle: string,
    content?: any
  ) {
    const ts = new TypeScriptWriter(output);

    if (apiType === APITYPE.graphql) {
    if (lambdaStyle === LAMBDA.multiple) {
      ts.writeLineIndented(`
      var AWS = require('aws-sdk');
      
      exports.handler = async() => {
        // write your code here
      }
      `);
    } else if (lambdaStyle === LAMBDA.single) {
      ts.writeLine(`exports.handler = async (event:Event) => {`);
      ts.writeLine(`switch (event.info.fieldName) {`);
      ts.writeLine();
      content();
      ts.writeLine();
      ts.writeLine(`}`);
      ts.writeLine(`}`);
    }
  }
  else {
    /* rest api  CURRENTLY WORKING*/
    ts.writeLine(`exports.handler = async (event: any) => {`);
      ts.writeLine(`try {`);
      ts.writeLine();
      ts.writeLine("const method = event.httpMethod;")
      ts.writeLine("const requestName = event.path.startsWith('/') ? event.path.substring(1) : event.path;")
      ts.writeLine("const body = JSON.parse(event.body);")
      content();
      ts.writeLine();
      ts.writeLine(`}`);
      ts.writeLine("catch(err) {")
      ts.writeLine(`}`);
  }
  }
  public importIndividualFunction(
    output: TextWriter,
    name: string,
    path: string
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports(path, [name]);
  }

  public helloWorldFunction(name: string) {
    this.writeLineIndented(`
    const AWS = require('aws-sdk');
    
    export const ${name} = async() => {
      // write your code here
    }
    `);
  }
}
