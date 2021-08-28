import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { APITYPE, LAMBDASTYLE } from "../../constant";
const model = require("../../model.json");
const { apiType } = model.api;

export class LambdaFunction extends CodeWriter {
  public initializeLambdaFunction(
    output: TextWriter,
    lambdaStyle: string,
    content?: any
  ) {
    const ts = new TypeScriptWriter(output);

    if (apiType === APITYPE.graphql) {
      if (lambdaStyle === LAMBDASTYLE.multi) {
        ts.writeLineIndented(`
      var AWS = require('aws-sdk');
      
      exports.handler = async(event:any) => {
        // write your code here
        const data = await axios.post('http://sandbox:8080', event)
      }
      `);
      } else if (lambdaStyle === LAMBDASTYLE.single) {
        ts.writeLine(`exports.handler = async (event:Event) => {`);
        ts.writeLine(`const data = await axios.post(http://sandbox:8080, event)`)
        ts.writeLine()
        ts.writeLine(`switch (event.info.fieldName) {`);
        ts.writeLine();
        content();
        ts.writeLine();
        ts.writeLine(`}`);
        ts.writeLine(`}`);
      }
    } else {
      /* rest api */
      ts.writeLine(`exports.handler = async (event: any) => {`);
      ts.writeLine(`const data = await axios.post(http://sandbox:8080, event)`)
      ts.writeLine(`try {`);
      ts.writeLine();
      ts.writeLine("const method = event.httpMethod;");
      ts.writeLine(
        "const requestName = event.path.startsWith('/') ? event.path.substring(1) : event.path;"
      );
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
