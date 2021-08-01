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
      ${managedPolicies.map((v) => `iam.ManagedPolicy.fromAwsManagedPolicyName("${v}"),`)}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsR0FBSSxTQUFRLGlCQUFVO0lBQzFCLFNBQVMsQ0FBQyxNQUFrQjtRQUNqQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSxvQkFBb0IsQ0FDekIsT0FBZSxFQUNmLE1BQWtCLEVBQ2xCLGVBQTBCO1FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsTUFBTSxRQUFRLEdBQUcsZUFBZTtZQUM5QixDQUFDLENBQUM7UUFDQSxlQUFlLENBQUMsR0FBRyxDQUNuQixDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsK0NBQStDLENBQUMsS0FBSyxDQUM3RDtPQUNBO1lBQ0QsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUVSLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDekI7WUFDRSxJQUFJLEVBQUUsR0FBRyxPQUFPLG9CQUFvQjtZQUNwQyxRQUFRLEVBQUUsVUFBVTtZQUNwQixXQUFXLEVBQUUsR0FBRyxFQUFFO2dCQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDOztpQkFFTixRQUFRO2NBQ1gsQ0FBQyxDQUFDO1lBQ1IsQ0FBQztTQUNGLEVBQ0QsT0FBTyxDQUNSLENBQUM7SUFDSixDQUFDO0lBRU0scUJBQXFCLENBQUMsTUFBa0IsRUFBRSxPQUFlO1FBQzlELE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsRUFBRSxDQUFDLHdCQUF3QixDQUN6QjtZQUNFLElBQUksRUFBRSxHQUFHLE9BQU8scUJBQXFCO1lBQ3JDLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFdBQVcsRUFBRSxHQUFHLEVBQUU7Z0JBQ2hCLEVBQUUsQ0FBQyxTQUFTLENBQUM7O21CQUVKLENBQUMsQ0FBQztZQUNiLENBQUM7U0FDRixFQUNELE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLHdCQUF3QixDQUFDLFFBQWdCO1FBQzlDLElBQUk7YUFDRCxTQUFTLENBQUMsR0FBRyxRQUFROzs7ZUFHYixDQUFDLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUExREQsa0JBMERDIn0=