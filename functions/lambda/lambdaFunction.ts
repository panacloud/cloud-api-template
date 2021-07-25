import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class LambdaFunction extends CodeWriter {
  public initializeLambdaFunction(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeLineIndented(`
    const AWS = require('aws-sdk');
    
    exports.handler = async() => {
      // write your code here
    }
    `);
  }
  // public importIndividualFunction(
  //   output: TextWriter,
  //   name: string,
  //   path: string
  // ) {
  //   const ts = new TypeScriptWriter(output);
  //   ts.writeImports(path, [name]);
  // }
  // public helloWorldFunction(name: string) {
  //   this.writeLineIndented(`
  //   const AWS = require('aws-sdk');
    
  //   export const ${name} = async() => {
  //     // write your code here
  //   }
  //   `);
  // }
}
