"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neptune = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Neptune extends core_1.CodeWriter {
    importNeptune(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_neptune as neptune"]);
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsT0FBUSxTQUFRLGlCQUFVO0lBQzlCLGFBQWEsQ0FBQyxNQUFrQjtRQUNyQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTSx3QkFBd0IsQ0FDN0IsT0FBZSxFQUNmLGlCQUF5QixFQUN6QixpQkFBeUIsRUFDekIsTUFBa0I7UUFFbEIsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsd0JBQXdCLENBQ3pCO1lBQ0UsSUFBSSxFQUFFLEdBQUcsT0FBTyxpQkFBaUI7WUFDakMsUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDLG9DQUFvQyxPQUFPO2lDQUNqQyxpQkFBaUI7b0NBQ2QsT0FBTztvQ0FDUCxpQkFBaUI7Y0FDdkMsQ0FBQyxDQUFDO1lBQ1IsQ0FBQztTQUNGLEVBQ0QsT0FBTyxDQUNSLENBQUM7SUFDSixDQUFDO0lBRU0sdUJBQXVCLENBQzVCLE9BQWUsRUFDZixPQUFlLEVBQ2YsTUFBa0I7UUFFbEIsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsd0JBQXdCLENBQ3pCO1lBQ0UsSUFBSSxFQUFFLEdBQUcsT0FBTyxnQkFBZ0I7WUFDaEMsUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDOztlQUVSLE9BQU87OzJDQUVxQixPQUFPOzJCQUN2QixPQUFPOztvQ0FFRSxPQUFPOzthQUU5QixDQUFDLENBQUM7WUFDUCxDQUFDO1NBQ0YsRUFDRCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFTSx5QkFBeUIsQ0FDOUIsT0FBZSxFQUNmLE9BQWUsRUFDZixrQkFBMEIsRUFDMUIsTUFBa0I7UUFFbEIsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsd0JBQXdCLENBQ3pCO1lBQ0UsSUFBSSxFQUFFLEdBQUcsT0FBTyxrQkFBa0I7WUFDbEMsUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDLG9DQUFvQyxPQUFPOzttQ0FFL0Isa0JBQWtCO2dDQUNyQixPQUFPO2NBQ3pCLENBQUMsQ0FBQztZQUNSLENBQUM7U0FDRixFQUNELE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLFlBQVksQ0FBQyxVQUFrQixFQUFFLFFBQWdCO1FBQ3RELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxRQUFRLGlCQUFpQixVQUFVLEdBQUcsQ0FBQyxDQUFDO0lBQzVELENBQUM7Q0FDRjtBQWxGRCwwQkFrRkMifQ==