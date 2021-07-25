import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Lambda extends CodeWriter {
  public importLambda(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_lambda as lambda"]);
  }

  public initializeLambda(apiName: string, output: TextWriter, functionName: string) {
    const ts = new TypeScriptWriter(output);
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
  public addEnvironment(lambda: string, functionName: string, envName: string, value: string) {
    this.writeLine(
      `${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`
    );
  }
}
