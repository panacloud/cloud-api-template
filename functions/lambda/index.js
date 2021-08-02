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
        if (lambdaStyle === "single") {
            this.writeLine(`${lambda}_lambdaFn.addEnvironment("${envName}", ${value});`);
        }
        else if (lambdaStyle === "multiple") {
            this.writeLine(`${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`);
        }
    }
    initializeTestForLambdaWithDynodb(funcName, handlerName) {
        this.writeLine(`expect(actual).to(
      haveResource("AWS::Lambda::Function", {
        FunctionName: "${funcName}",
        Handler: "${handlerName}.handler",
        Runtime: "nodejs12.x",
        Environment: {
          Variables: {
            TABLE_NAME: {
              Ref: stack.getLogicalId(
                dbConstruct[0].node.defaultChild as cdk.CfnElement
              ),
            },
          },
        },
      })
    );`);
    }
}
exports.Lambda = Lambda;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBT3pELE1BQWEsTUFBTyxTQUFRLGlCQUFVO0lBQzdCLFlBQVksQ0FBQyxNQUFrQjtRQUNwQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFTSxnQkFBZ0IsQ0FDckIsT0FBZSxFQUNmLE1BQWtCLEVBQ2xCLFdBQW1CLEVBQ25CLFlBQXFCLEVBQ3JCLE9BQWdCLEVBQ2hCLGtCQUEyQixFQUMzQixZQUE0QixFQUM1QixVQUFtQixFQUNuQixRQUFpQjtRQUVqQixNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXhDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQzVDLElBQUksY0FBYyxHQUFHLGtCQUFrQjtZQUNyQyxDQUFDLENBQUMsb0JBQW9CLGtCQUFrQixJQUFJO1lBQzVDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDUCxJQUFJLEdBQUcsR0FBRyxZQUFZO1lBQ3BCLENBQUMsQ0FBQztRQUNBLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDL0M7WUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1AsSUFBSSxTQUFTLEdBQUcsVUFBVTtZQUN4QixDQUFDLENBQUMsNkJBQTZCLFVBQVUsS0FBSztZQUM5QyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ1AsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFaEQsSUFBSSxXQUFXLEtBQUssUUFBUSxFQUFFO1lBQzVCLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDekI7Z0JBQ0UsSUFBSSxFQUFFLEdBQUcsT0FBTyxXQUFXO2dCQUMzQixRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixXQUFXLEVBQUUsR0FBRyxFQUFFO29CQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDLDhCQUE4QixPQUFPOzJCQUNuQyxPQUFPOzs7O1lBSXRCLElBQUk7V0FDTCxHQUFHO1lBQ0YsY0FBYztZQUNkLEdBQUc7WUFDSCxTQUFTO2dCQUNMLENBQUMsQ0FBQztnQkFDUixDQUFDO2FBQ0YsRUFDRCxPQUFPLENBQ1IsQ0FBQztTQUNIO2FBQU0sSUFBSSxXQUFXLEtBQUssVUFBVSxFQUFFO1lBQ3JDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDekI7Z0JBQ0UsSUFBSSxFQUFFLEdBQUcsT0FBTyxhQUFhLFlBQVksRUFBRTtnQkFDM0MsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsV0FBVyxFQUFFLEdBQUcsRUFBRTtvQkFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsT0FBTyxTQUFTLFlBQVk7MkJBQ3hELE9BQU8sU0FBUyxZQUFZOztzQkFFakMsWUFBWTs7WUFFdEIsSUFBSTtXQUNMLEdBQUc7WUFDRixjQUFjO1lBQ2QsR0FBRztZQUNILFNBQVM7V0FDVixDQUFDLENBQUM7Z0JBQ0gsQ0FBQzthQUNGLEVBQ0QsT0FBTyxDQUNSLENBQUM7U0FDSDtJQUNILENBQUM7SUFFTSxpQkFBaUIsQ0FBQyxVQUFrQixFQUFFLFNBQWlCO1FBQzVELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLHVCQUF1QixTQUFTLElBQUksQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFTSxjQUFjLENBQ25CLE1BQWMsRUFDZCxPQUFlLEVBQ2YsS0FBYSxFQUNiLFdBQW1CLEVBQ25CLFlBQXFCO1FBRXJCLElBQUksV0FBVyxLQUFLLFFBQVEsRUFBRTtZQUM1QixJQUFJLENBQUMsU0FBUyxDQUNaLEdBQUcsTUFBTSw2QkFBNkIsT0FBTyxNQUFNLEtBQUssSUFBSSxDQUM3RCxDQUFDO1NBQ0g7YUFBTSxJQUFJLFdBQVcsS0FBSyxVQUFVLEVBQUU7WUFDckMsSUFBSSxDQUFDLFNBQVMsQ0FDWixHQUFHLE1BQU0sYUFBYSxZQUFZLG9CQUFvQixPQUFPLE1BQU0sS0FBSyxJQUFJLENBQzdFLENBQUM7U0FDSDtJQUNILENBQUM7SUFDTSxpQ0FBaUMsQ0FBQyxRQUFlLEVBQUMsV0FBa0I7UUFDekUsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7eUJBRU0sUUFBUTtvQkFDYixXQUFXOzs7Ozs7Ozs7Ozs7T0FZeEIsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUNGO0FBckhELHdCQXFIQyJ9