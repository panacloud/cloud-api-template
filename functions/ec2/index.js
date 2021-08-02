"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ec2 = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Ec2 extends core_1.CodeWriter {
    importEc2(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_ec2 as ec2"]);
    }
    initializeVpc(apiName, output, subnetConfig) {
        const ts = new typescript_1.TypeScriptWriter(output);
        const config = subnetConfig
            ? `, {subnetConfiguration: [
      ${subnetConfig}
    ] }`
            : " ";
        ts.writeVariableDeclaration({
            name: `${apiName}_vpc`,
            typeName: "",
            initializer: () => {
                ts.writeLine(` new ec2.Vpc(this, "${apiName}Vpc" ${config} );`);
            },
        }, "const");
    }
    initializeSecurityGroup(apiName, vpcName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
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
        }, "const");
    }
    securityGroupAddIngressRule(apiName, securityGroupName) {
        this.writeLine(`${securityGroupName}.addIngressRule(${securityGroupName}, ec2.Port.tcp(8182), "${apiName}Rule");`);
    }
}
exports.Ec2 = Ec2;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsR0FBSSxTQUFRLGlCQUFVO0lBQzFCLFNBQVMsQ0FBQyxNQUFrQjtRQUNqQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxhQUFhLENBQ2xCLE9BQWUsRUFDZixNQUFrQixFQUNsQixZQUFxQjtRQUVyQixNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sTUFBTSxHQUFHLFlBQVk7WUFDekIsQ0FBQyxDQUFDO1FBQ0EsWUFBWTtRQUNaO1lBQ0YsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUNSLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDekI7WUFDRSxJQUFJLEVBQUUsR0FBRyxPQUFPLE1BQU07WUFDdEIsUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDLHVCQUF1QixPQUFPLFFBQVEsTUFBTSxLQUFLLENBQUMsQ0FBQztZQUNsRSxDQUFDO1NBQ0YsRUFDRCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFTSx1QkFBdUIsQ0FDNUIsT0FBZSxFQUNmLE9BQWUsRUFDZixNQUFrQjtRQUVsQixNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDekI7WUFDRSxJQUFJLEVBQUUsR0FBRyxPQUFPLEtBQUs7WUFDckIsUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxPQUFPO21CQUMzQyxPQUFPOzs0QkFFRSxPQUFPO2tDQUNELE9BQU87O1dBRTlCLENBQUMsQ0FBQztZQUNMLENBQUM7U0FDRixFQUNELE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLDJCQUEyQixDQUNoQyxPQUFlLEVBQ2YsaUJBQXlCO1FBRXpCLElBQUksQ0FBQyxTQUFTLENBQ1osR0FBRyxpQkFBaUIsbUJBQW1CLGlCQUFpQiwwQkFBMEIsT0FBTyxTQUFTLENBQ25HLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUE3REQsa0JBNkRDIn0=