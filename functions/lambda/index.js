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
    initializeLambda(apiName, output, lambdaStyle, functionName, vpcName, securityGroupsName, environments, vpcSubnets) {
        const ts = new typescript_1.TypeScriptWriter(output);
        let vpc = vpcName ? `vpc: ${vpcName}` : ts.clearIndent();
        let securityGroups = securityGroupsName
            ? `securityGroups: [${securityGroupsName}]`
            : ts.clearIndent();
        let env = environments
            ? `environment: {
      ${environments.map((v) => `${v.name}: ${v.value}`)}
    }`
            : ts.clearIndent();
        let vpcSubnet = vpcSubnets
            ? `vpcSubnets: { subnetType: ${vpcSubnets} }`
            : ts.clearIndent();
        console.log(environments === null || environments === void 0 ? void 0 : environments.map((v) => `${v.name}: ${v.value}`));
        console.log(securityGroups);
        console.log(vpcSubnet);
        if (lambdaStyle === "single lambda") {
            ts.writeVariableDeclaration({
                name: `${apiName}_lambdaFn`,
                typeName: "lambda.Function",
                initializer: () => {
                    ts.writeLine(`new lambda.Function(this, "${apiName}Lambda", {
          functionName: "${apiName}Lambda",
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: "main.handler",
          code: lambda.Code.fromAsset("lambda-fns"),
         ${vpc},
          ${securityGroups},
          ${env},
          ${vpcSubnet},
          `);
                },
            }, "const");
        }
        else if (lambdaStyle === "multiple lambda") {
            ts.writeVariableDeclaration({
                name: `${apiName}_lambdaFn_${functionName}`,
                typeName: "lambda.Function",
                initializer: () => {
                    ts.writeLine(`new lambda.Function(this, "${apiName}Lambda${functionName}", {
          functionName: "${apiName}Lambda${functionName}",
          runtime: lambda.Runtime.NODEJS_12_X,
          handler: "${functionName}.handler",
          code: lambda.Code.fromAsset("lambda-fns"),
          memorySize: 1024,
        });`);
                },
            }, "const");
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBT3pELE1BQWEsTUFBTyxTQUFRLGlCQUFVO0lBQzdCLFlBQVksQ0FBQyxNQUFrQjtRQUNwQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTSxnQkFBZ0IsQ0FDckIsT0FBZSxFQUNmLE1BQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLFlBQXFCLEVBQ3JCLE9BQWdCLEVBQ2hCLGtCQUEyQixFQUMzQixZQUE0QixFQUM1QixVQUFtQjtRQUVuQixNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3pELElBQUksY0FBYyxHQUFHLGtCQUFrQjtZQUNyQyxDQUFDLENBQUMsb0JBQW9CLGtCQUFrQixHQUFHO1lBQzNDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsSUFBSSxHQUFHLEdBQUcsWUFBWTtZQUNwQixDQUFDLENBQUM7UUFDQSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO01BQ2xEO1lBQ0EsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixJQUFJLFNBQVMsR0FBRyxVQUFVO1lBQ3hCLENBQUMsQ0FBQyw2QkFBNkIsVUFBVSxJQUFJO1lBQzdDLENBQUMsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLGFBQVosWUFBWSx1QkFBWixZQUFZLENBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUE7UUFDOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXZCLElBQUksV0FBVyxLQUFLLGVBQWUsRUFBRTtZQUNuQyxFQUFFLENBQUMsd0JBQXdCLENBQ3pCO2dCQUNFLElBQUksRUFBRSxHQUFHLE9BQU8sV0FBVztnQkFDM0IsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsV0FBVyxFQUFFLEdBQUcsRUFBRTtvQkFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsT0FBTzsyQkFDbkMsT0FBTzs7OztXQUl2QixHQUFHO1lBQ0YsY0FBYztZQUNkLEdBQUc7WUFDSCxTQUFTO1dBQ1YsQ0FBQyxDQUFDO2dCQUNILENBQUM7YUFDRixFQUNELE9BQU8sQ0FDUixDQUFDO1NBQ0g7YUFBTSxJQUFJLFdBQVcsS0FBSyxpQkFBaUIsRUFBRTtZQUM1QyxFQUFFLENBQUMsd0JBQXdCLENBQ3pCO2dCQUNFLElBQUksRUFBRSxHQUFHLE9BQU8sYUFBYSxZQUFZLEVBQUU7Z0JBQzNDLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFdBQVcsRUFBRSxHQUFHLEVBQUU7b0JBQ2hCLEVBQUUsQ0FBQyxTQUFTLENBQUMsOEJBQThCLE9BQU8sU0FBUyxZQUFZOzJCQUN4RCxPQUFPLFNBQVMsWUFBWTs7c0JBRWpDLFlBQVk7OztZQUd0QixDQUFDLENBQUM7Z0JBQ0osQ0FBQzthQUNGLEVBQ0QsT0FBTyxDQUNSLENBQUM7U0FDSDtJQUNILENBQUM7SUFDTSxjQUFjLENBQ25CLE1BQWMsRUFDZCxPQUFlLEVBQ2YsS0FBYSxFQUNiLFdBQW1CLEVBQ25CLFlBQXFCO1FBRXJCLElBQUksV0FBVyxLQUFLLGVBQWUsRUFBRTtZQUNuQyxJQUFJLENBQUMsU0FBUyxDQUNaLEdBQUcsTUFBTSw2QkFBNkIsT0FBTyxNQUFNLEtBQUssSUFBSSxDQUM3RCxDQUFDO1NBQ0g7YUFBTSxJQUFJLFdBQVcsS0FBSyxpQkFBaUIsRUFBRTtZQUM1QyxJQUFJLENBQUMsU0FBUyxDQUNaLEdBQUcsTUFBTSxhQUFhLFlBQVksb0JBQW9CLE9BQU8sTUFBTSxLQUFLLElBQUksQ0FDN0UsQ0FBQztTQUNIO0lBQ0gsQ0FBQztDQUNGO0FBMUZELHdCQTBGQyJ9