import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Ec2 extends CodeWriter {
  public initializeVpc(
    apiName: string,
    output: TextWriter,
    subnetConfig?: string
  ) {
    const ts = new TypeScriptWriter(output);
    const config = subnetConfig
      ? `, {subnetConfiguration: [
      ${subnetConfig}
    ] }`
      : " ";
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_vpc`,
        typeName: "",
        initializer: () => {
          ts.writeLine(` new ec2.Vpc(this, "${apiName}Vpc" ${config} );`);
        },
      },
      "const"
    );
  }

  public initializeSecurityGroup(
    apiName: string,
    vpcName: string,
    output: TextWriter
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_sg`,
        typeName: "",
        initializer: () => {
          ts.writeLine(`new ec2.SecurityGroup(this, "${apiName}SecurityGroup", {
            vpc: ${vpcName},
            allowAllOutbound: true,
            description: "${apiName} security group",
            securityGroupName: "${apiName}SecurityGroup",
          });
          `);
        },
      },
      "const"
    );
  }

  public securityGroupAddIngressRule(
    apiName: string,
    securityGroupName: string
  ) {
    this.writeLine(
      `${securityGroupName}.addIngressRule(${securityGroupName}, ec2.Port.tcp(8182), "${apiName}Rule");`
    );
  }
}
