"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neptune = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Neptune extends core_1.CodeWriter {
    initializeNeptuneCluster(apiName, neptuneSubnetName, securityGroupName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${apiName}_neptuneCluster`,
            typeName: "",
            initializer: () => {
                ts.writeLine(` new neptune.CfnDBCluster(this, "${apiName}Cluster", {
            dbSubnetGroupName: ${neptuneSubnetName}.dbSubnetGroupName,
            dbClusterIdentifier: "${apiName}Cluster",
            vpcSecurityGroupIds: [${securityGroupName}.securityGroupId],
          });`);
            },
        }, "const");
    }
    initializeNeptuneSubnet(apiName, vpcName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
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
        }, "const");
    }
    initializeNeptuneInstance(apiName, vpcName, neptuneClusterName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${apiName}_neptuneInstance`,
            typeName: "",
            initializer: () => {
                ts.writeLine(`new neptune.CfnDBInstance(this, "${apiName}instance", {
            dbInstanceClass: "db.t3.medium",
            dbClusterIdentifier: ${neptuneClusterName}.dbClusterIdentifier,
            availabilityZone: ${vpcName}.availabilityZones[0],
          });`);
            },
        }, "const");
    }
    addDependsOn(sourceName, depended) {
        this.writeLine(`${depended}.addDependsOn(${sourceName})`);
    }
}
exports.Neptune = Neptune;
