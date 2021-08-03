import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LAMBDA } from "../../cloud-api-constants";

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

    let vpc = vpcName ? `vpc: ${vpcName},` : "";
    let securityGroups = securityGroupsName
      ? `securityGroups: [${securityGroupsName}],`
      : "";
    let env = environments
      ? `environment: {
      ${environments.map((v) => `${v.name}: ${v.value}`)},
      },`
      : "";
    let vpcSubnet = vpcSubnets
      ? `vpcSubnets: { subnetType: ${vpcSubnets} },`
      : "";
    let role = roleName ? `role: ${roleName},` : "";

    if (lambdaStyle === LAMBDA.single) {
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
          ${role}
         ${vpc}
          ${securityGroups}
          ${env}
          ${vpcSubnet}
             })`);
          },
        },
        "const"
      );
    } else if (lambdaStyle === LAMBDA.multiple) {
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
          ${role}
         ${vpc}
          ${securityGroups}
          ${env}
          ${vpcSubnet}
        })`);
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
    if (lambdaStyle === LAMBDA.single) {
      this.writeLine(
        `${lambda}_lambdaFn.addEnvironment("${envName}", ${value});`
      );
    } else if (lambdaStyle === LAMBDA.multiple) {

      this.writeLine(
        `${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`
      );
    }
  }
}
