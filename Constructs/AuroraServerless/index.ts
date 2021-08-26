import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class AuroraServerless extends CodeWriter {

  public initializeAuroraCluster(
    apiName: string,
    vpcName: string,
    output: TextWriter
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_db`,
        typeName: "",
        initializer: () => {
          ts.writeLine(`new rds.ServerlessCluster(this, "${apiName}DB", {
            vpc: ${vpcName},
            engine: rds.DatabaseClusterEngine.auroraMysql({
              version: rds.AuroraMysqlEngineVersion.VER_5_7_12,
            }),
            scaling: {
              autoPause: Duration.minutes(10), 
              minCapacity: rds.AuroraCapacityUnit.ACU_8, 
              maxCapacity: rds.AuroraCapacityUnit.ACU_32,
            },
            deletionProtection: false,
            defaultDatabaseName: "${apiName}DB",
          });`);
        },
      },
      "const"
    );
  }

  public connectionsAllowFromAnyIpv4(sourceName: string) {
    this.writeLine(
      `${sourceName}.connections.allowFromAnyIpv4(ec2.Port.tcp(3306));`
    );
  }
}
