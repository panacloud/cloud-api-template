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
              autoPause: cdk.Duration.minutes(10), 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsZ0JBQWlCLFNBQVEsaUJBQVU7SUFDdkMsU0FBUyxDQUFDLE1BQWtCO1FBQ2pDLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVNLHVCQUF1QixDQUM1QixPQUFlLEVBQ2YsT0FBZSxFQUNmLE1BQWtCO1FBRWxCLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsRUFBRSxDQUFDLHdCQUF3QixDQUN6QjtZQUNFLElBQUksRUFBRSxHQUFHLE9BQU8sS0FBSztZQUNyQixRQUFRLEVBQUUsRUFBRTtZQUNaLFdBQVcsRUFBRSxHQUFHLEVBQUU7Z0JBQ2hCLEVBQUUsQ0FBQyxTQUFTLENBQUMsb0NBQW9DLE9BQU87bUJBQy9DLE9BQU87Ozs7Ozs7Ozs7b0NBVVUsT0FBTztjQUM3QixDQUFDLENBQUM7WUFDUixDQUFDO1NBQ0YsRUFDRCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFTSwyQkFBMkIsQ0FBQyxVQUFrQjtRQUNuRCxJQUFJLENBQUMsU0FBUyxDQUNaLEdBQUcsVUFBVSxvREFBb0QsQ0FDbEUsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXpDRCw0Q0F5Q0MifQ==