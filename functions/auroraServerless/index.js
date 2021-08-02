"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuroraServerless = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class AuroraServerless extends core_1.CodeWriter {
    importRds(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_rds as rds"]);
    }
    initializeAuroraCluster(apiName, vpcName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
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
        }, "const");
    }
    connectionsAllowFromAnyIpv4(sourceName) {
        this.writeLine(`${sourceName}.connections.allowFromAnyIpv4(ec2.Port.tcp(3306));`);
    }
}
exports.AuroraServerless = AuroraServerless;
