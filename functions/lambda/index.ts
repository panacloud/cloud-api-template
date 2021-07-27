import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Lambda extends CodeWriter {
  public importLambda(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_lambda as lambda"]);
  }

  public initializeLambda(apiName: string, output: TextWriter, lambdaStyle: string, functionName?: string) {
    const ts = new TypeScriptWriter(output);

    if(lambdaStyle === "single lambda") {
      ts.writeVariableDeclaration(
        {
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
        },
        "const"
      );
    }
    else if(lambdaStyle === "multiple lambda") {
      ts.writeVariableDeclaration(
        {
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
        },
        "const"
      );
    }
  }
  public addEnvironment(lambda: string, envName: string, value: string, lambdaStyle: string, functionName?: string) {
    
    if(lambdaStyle === "single lambda") {
      this.writeLine(
        `${lambda}_lambdaFn.addEnvironment("${envName}", ${value});`
      );
    }
    else if(lambdaStyle === "multiple lambda") {
      this.writeLine(
        `${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`
      );
    }


  }
}
