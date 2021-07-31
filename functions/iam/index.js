"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iam = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Iam extends core_1.CodeWriter {
    importIam(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_iam as iam"]);
    }
    serviceRoleForLambda(apiName, output, managedPolicies) {
        const ts = new typescript_1.TypeScriptWriter(output);
        const policies = managedPolicies
            ? `managedPolicies: [
      ${managedPolicies.map((v) => `iam.ManagedPolicy.fromAwsManagedPolicyName(${v}),`)}
    ],`
            : " ";
        ts.writeVariableDeclaration({
            name: `${apiName}Lambda_serviceRole`,
            typeName: "iam.Role",
            initializer: () => {
                ts.writeLine(`new iam.Role(this,'lambdaServiceRole',{
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
               ${policies}
          });`);
            },
        }, "const");
    }
    serviceRoleForAppsync(output, apiName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${apiName}Appsync_serviceRole`,
            typeName: "iam.Role",
            initializer: () => {
                ts.writeLine(`new iam.Role(this,'appsyncServiceRole',{
                assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
               });`);
            },
        }, "const");
    }
    attachLambdaPolicyToRole(roleName) {
        this
            .writeLine(`${roleName}_serviceRole.addToPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['lambda:InvokeFunction'],
          }));`);
    }
}
exports.Iam = Iam;
