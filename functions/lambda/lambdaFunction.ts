import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class LambdaFunction extends CodeWriter {
  public initializeLambdaFunction(output: TextWriter, lambdaStyle: string, content?: any) {
    const ts = new TypeScriptWriter(output);

    if(lambdaStyle === "multiple lambda") {
      ts.writeLineIndented(`
      const AWS = require('aws-sdk');
      
      exports.handler = async() => {
        // write your code here
      }
      `);
    }
    else if(lambdaStyle === "single lambda") {
      ts.writeLine(`exports.handler = async (event:Event) => {`);
      ts.writeLine(`switch (event.info.fieldName) {`);
      ts.writeLine();
      content();
      ts.writeLine();
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
