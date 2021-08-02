import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Neptune extends CodeWriter {
  public importNeptune(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_neptune as neptune"]);
  }

  public initializeNeptuneCluster(
    apiName: string,
    neptuneSubnetName: string,
    securityGroupName: string,
    output: TextWriter
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_neptuneCluster`,
        typeName: "",
        initializer: () => {
          ts.writeLine(` new neptune.CfnDBCluster(this, "${apiName}Cluster", {
            dbSubnetGroupName: ${neptuneSubnetName}.dbSubnetGroupName,
            dbClusterIdentifier: "${apiName}Cluster",
            vpcSecurityGroupIds: [${securityGroupName}.securityGroupId],
          });`);
        },
      },
      "const"
    );
  }

  public initializeNeptuneSubnet(
    apiName: string,
    vpcName: string,
    output: TextWriter
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_neptuneSubnet`,
        typeName: "",
        initializer: () => {
          ts.writeLine(` new neptune.CfnDBSubnetGroup(
            this,
            "${apiName}neptuneSubnetGroup",
            {
              dbSubnetGroupDescription: "${apiName} Subnet",
              subnetIds: ${vpcName}.selectSubnets({ subnetType: ec2.SubnetType.ISOLATED })
                .subnetIds,
              dbSubnetGroupName: "${apiName}_subnetgroup",
            }
          );`);
        },
      },
      "const"
    );
  }

  public initializeNeptuneInstance(
    apiName: string,
    vpcName: string,
    neptuneClusterName: string,
    output: TextWriter
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_neptuneInstance`,
        typeName: "",
        initializer: () => {
          ts.writeLine(`new neptune.CfnDBInstance(this, "${apiName}instance", {
            dbInstanceClass: "db.t3.medium",
            dbClusterIdentifier: ${neptuneClusterName}.dbClusterIdentifier,
            availabilityZone: ${vpcName}.availabilityZones[0],
          });`);
        },
      },
      "const"
    );
  }

  public addDependsOn(sourceName: string, depended: string) {
    this.writeLine(`${depended}.addDependsOn(${sourceName})`);
  }
}
