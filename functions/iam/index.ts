import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Iam extends CodeWriter {
  public importIam(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_iam as iam"]);
  }

  public serviceRoleForLambda(
    apiName: string,
    output: TextWriter,
    managedPolicies?: string[]
  ) {
    const ts = new TypeScriptWriter(output);
    const policies = managedPolicies
      ? `managedPolicies: [
      ${managedPolicies.map((v) => `${v}`)}
    ]`
      : ts.clearIndent();

    ts.writeVariableDeclaration(
      {
        name: `${apiName}_serviceRole`,
        typeName: "iam.Role",
        initializer: () => {
          ts.writeLine(`new iam.Role(this,'lambdaServiceRole',{
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
               ${policies}
          });`);
        },
      },
      "const"
    );
  }

  public serviceRoleForAppsync(output: TextWriter, apiName: string) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_servRole`,
        typeName: "iam.Role",
        initializer: () => {
          ts.writeLine(`new iam.Role(this,'appsyncServiceRole',{
                assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
               });`);
        },
      },
      "const"
    );
  }

  public attachLambdaPolicyToRole(roleName: string) {
    this.writeLine(`${roleName}_servRole.addToPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['lambda:InvokeFunction'],
          }));`);
  }
}
