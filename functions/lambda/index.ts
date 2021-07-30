import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

interface Environment {
  name: string;
  value: string;
}

export class Lambda extends CodeWriter {
  public importLambda(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_lambda as lambda"]);
  }

  public initializeLambda(
    apiName: string,
    output: TextWriter,
    lambdaStyle: string,
    functionName?: string,
    vpcName?: string,
    securityGroupsName?: string,
    environments?: Environment[],
    vpcSubnets?: string,
    roleName?: string
  ) {
    const ts = new TypeScriptWriter(output);

    let vpc = vpcName ? `vpc: ${vpcName}` : ts.clearIndent();
    let securityGroups = securityGroupsName
      ? `securityGroups: [${securityGroupsName}]`
      : ts.clearIndent();
    let env = environments
      ? `environment: {
      ${environments.map((v) => `${v.name}: ${v.value}`)}
    }`
      : ts.clearIndent();
    let vpcSubnet = vpcSubnets
      ? `vpcSubnets: { subnetType: "${vpcSubnets}" }`
      : ts.clearIndent();
    let role = roleName ? `role: ${roleName}` : ts.clearIndent();

    if (lambdaStyle === "single lambda") {
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
          ${role},
         ${vpc},
          ${securityGroups},
          ${env},
          ${vpcSubnet},
          `);
          },
        },
        "const"
      );
    } else if (lambdaStyle === "multiple lambda") {
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
          ${role},
         ${vpc},
          ${securityGroups},
          ${env},
          ${vpcSubnet},
        });`);
          },
        },
        "const"
      );
    }
  }

  public nodeAddDependency(sourceName: string, valueName: string) {
    this.writeLine(`${sourceName}.node.addDependency(${valueName});`);
  }

  public addEnvironment(
    lambda: string,
    envName: string,
    value: string,
    lambdaStyle: string,
    functionName?: string
  ) {
    if (lambdaStyle === "single lambda") {
      this.writeLine(
        `${lambda}_lambdaFn.addEnvironment("${envName}", ${value});`
      );
    } else if (lambdaStyle === "multiple lambda") {
      this.writeLine(
        `${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`
      );
    }
  }
}
