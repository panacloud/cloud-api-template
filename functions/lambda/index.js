"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Lambda extends core_1.CodeWriter {
    importLambda(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_lambda as lambda"]);
    }
    initializeLambda(apiName, output, lambdaStyle, functionName, vpcName, securityGroupsName, environments, vpcSubnets, roleName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        let vpc = vpcName ? `vpc: ${vpcName},` : "";
        let securityGroups = securityGroupsName
            ? `securityGroups: [${securityGroupsName}],`
            : "";
        let env = environments
            ? `environment: {
      ${environments.map((v) => `${v.name}: ${v.value}`)},
      },`
            : "";
        let vpcSubnet = vpcSubnets
            ? `vpcSubnets: { subnetType: ${vpcSubnets} },`
            : "";
        let role = roleName ? `role: ${roleName},` : "";
        console.log(vpc);
        console.log(securityGroups);
        console.log(env);
        if (lambdaStyle === "single") {
            ts.writeVariableDeclaration({
                name: `${apiName}_lambdaFn`,
                typeName: "lambda.Function",
                initializer: () => {
                    ts.writeLine(`new lambda.Function(this, "${apiName}Lambda", {
          functionName: "${apiName}Lambda",
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: "main.handler",
          code: lambda.Code.fromAsset("lambda-fns"),
          ${role}
         ${vpc}
          ${securityGroups}
          ${env}
          ${vpcSubnet}
             })`);
                },
            }, "const");
        }
        else if (lambdaStyle === "multiple") {
            ts.writeVariableDeclaration({
                name: `${apiName}_lambdaFn_${functionName}`,
                typeName: "lambda.Function",
                initializer: () => {
                    ts.writeLine(`new lambda.Function(this, "${apiName}Lambda${functionName}", {
          functionName: "${apiName}Lambda${functionName}",
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: "${functionName}.handler",
          code: lambda.Code.fromAsset("lambda-fns"),
          ${role}
         ${vpc}
          ${securityGroups}
          ${env}
          ${vpcSubnet}
        })`);
                },
            }, "const");
        }
    }
    nodeAddDependency(sourceName, valueName) {
        this.writeLine(`${sourceName}.node.addDependency(${valueName});`);
    }
    addEnvironment(lambda, envName, value, lambdaStyle, functionName) {
        if (lambdaStyle === "single lambda") {
            this.writeLine(`${lambda}_lambdaFn.addEnvironment("${envName}", ${value});`);
        }
        else if (lambdaStyle === "multiple lambda") {
            this.writeLine(`${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`);
        }
    }
}
exports.Lambda = Lambda;
