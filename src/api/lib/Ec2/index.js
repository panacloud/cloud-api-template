"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ec2 = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Ec2 extends core_1.CodeWriter {
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
