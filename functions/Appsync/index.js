"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appsync = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Appsync extends core_1.CodeWriter {
    constructor() {
        super(...arguments);
        this.apiName = "appsync_api";
        // public lambdaDataSourceResolverMutation(value: string) {
        //   this.writeLineIndented(` lambdaDs.createResolver({
        //     typeName: "Mutation",
        //     fieldName: "${value}",
        //   });`);
        // }
    }
    // public ds: string = "ds_";
    importAppsync(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_appsync as appsync"]);
    }
    initializeAppsyncApi(name, output, authenticationType) {
        this.apiName = name;
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${this.apiName}_appsync`,
            typeName: "appsync.CfnGraphQLApi",
            initializer: () => {
                ts.writeLine(`new appsync.CfnGraphQLApi(this,'${this.apiName}',{
          authenticationType:'API_KEY',
          name: '${this.apiName}',
        })`);
            },
        }, "const");
    }
    initializeAppsyncSchema(schema, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        const gqlSchema = "`" + schema + "`";
        ts.writeVariableDeclaration({
            name: `${this.apiName}_schema`,
            typeName: "appsync.CfnGraphQLSchema",
            initializer: () => {
                ts.writeLine(`new appsync.CfnGraphQLSchema(this,'${this.apiName}Schema',{
            apiId: ${this.apiName}_appsync.attrApiId,
            definition:${gqlSchema}
          })`);
            },
        }, "const");
    }
    initializeApiKeyForAppsync(apiName) {
        this.writeLine(`new appsync.CfnApiKey(this,"apiKey",{
        apiId:${apiName}_appsync.attrApiId
      })`);
    }
    appsyncDataSource(output, dataSourceName, serviceRole, lambdaStyle, functionName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        // this.ds = `ds_${dataSourceName}_${functionName}`;
        if (lambdaStyle === "single lambda") {
            ts.writeVariableDeclaration({
                name: `ds_${dataSourceName}`,
                typeName: "appsync.CfnDataSource",
                initializer: () => {
                    ts.writeLine(`new appsync.CfnDataSource(this,'${this.apiName + "dataSourceGraphql"}',{
            name: '${this.apiName + dataSourceName}',
            apiId: ${this.apiName}_appsync.attrApiId,
            type:"AWS_LAMBDA",
            lambdaConfig: {lambdaFunctionArn:${this.apiName}_lambdaFn.functionArn},
            serviceRoleArn:${serviceRole}_servRole.roleArn
           })`);
                },
            }, "const");
        }
        else if (lambdaStyle === "multiple lambda") {
            ts.writeVariableDeclaration({
                name: `ds_${dataSourceName}_${functionName}`,
                typeName: "appsync.CfnDataSource",
                initializer: () => {
                    ts.writeLine(`new appsync.CfnDataSource(this,'${this.apiName + "dataSourceGraphql"}',{
            name: '${this.apiName + dataSourceName + functionName}',
            apiId: ${this.apiName}_appsync.attrApiId,
            type:"AWS_LAMBDA",
            lambdaConfig: {lambdaFunctionArn:${this.apiName}_lambdaFn_${functionName}.functionArn},
            serviceRoleArn:${serviceRole}_servRole.roleArn
           })`);
                },
            }, "const");
        }
    }
    lambdaDataSourceResolver(fieldName, typeName, dataSourceName) {
        this
            .writeLineIndented(`new appsync.CfnResolver(this,'${fieldName}_resolver',{
      apiId: ${this.apiName}_appsync.attrApiId,
      typeName: "${typeName}",
      fieldName: "${fieldName}",
      dataSourceName: ${dataSourceName}.name
    })`);
    }
}
exports.Appsync = Appsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsT0FBUSxTQUFRLGlCQUFVO0lBQXZDOztRQUNTLFlBQU8sR0FBVyxhQUFhLENBQUM7UUE4SHZDLDJEQUEyRDtRQUMzRCx1REFBdUQ7UUFDdkQsNEJBQTRCO1FBQzVCLDZCQUE2QjtRQUM3QixXQUFXO1FBQ1gsSUFBSTtJQUNOLENBQUM7SUFuSUMsNkJBQTZCO0lBRXRCLGFBQWEsQ0FBQyxNQUFrQjtRQUNyQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTSxvQkFBb0IsQ0FDekIsSUFBWSxFQUNaLE1BQWtCLEVBQ2xCLGtCQUEyQjtRQUUzQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDekI7WUFDRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxVQUFVO1lBQy9CLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsV0FBVyxFQUFFLEdBQUcsRUFBRTtnQkFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsSUFBSSxDQUFDLE9BQU87O21CQUVuRCxJQUFJLENBQUMsT0FBTztXQUNwQixDQUFDLENBQUM7WUFDTCxDQUFDO1NBQ0YsRUFDRCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFTSx1QkFBdUIsQ0FBQyxNQUFjLEVBQUUsTUFBa0I7UUFDL0QsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxNQUFNLFNBQVMsR0FBRyxHQUFHLEdBQUcsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNyQyxFQUFFLENBQUMsd0JBQXdCLENBQ3pCO1lBQ0UsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sU0FBUztZQUM5QixRQUFRLEVBQUUsMEJBQTBCO1lBQ3BDLFdBQVcsRUFBRSxHQUFHLEVBQUU7Z0JBQ2hCLEVBQUUsQ0FBQyxTQUFTLENBQUMsc0NBQXNDLElBQUksQ0FBQyxPQUFPO3FCQUNwRCxJQUFJLENBQUMsT0FBTzt5QkFDUixTQUFTO2FBQ3JCLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDRixFQUNELE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLDBCQUEwQixDQUFDLE9BQWU7UUFDL0MsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDSCxPQUFPO1NBQ2QsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVNLGlCQUFpQixDQUN0QixNQUFrQixFQUNsQixjQUFzQixFQUN0QixXQUFtQixFQUNuQixXQUFtQixFQUNuQixZQUFxQjtRQUVyQixNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLG9EQUFvRDtRQUVwRCxJQUFHLFdBQVcsS0FBSyxlQUFlLEVBQUU7WUFDbEMsRUFBRSxDQUFDLHdCQUF3QixDQUN6QjtnQkFDRSxJQUFJLEVBQUUsTUFBTSxjQUFjLEVBQUU7Z0JBQzVCLFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLFdBQVcsRUFBRSxHQUFHLEVBQUU7b0JBQ2hCLEVBQUUsQ0FBQyxTQUFTLENBQUMsbUNBQ1gsSUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFDakI7cUJBQ1MsSUFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjO3FCQUM3QixJQUFJLENBQUMsT0FBTzs7K0NBR25CLElBQUksQ0FBQyxPQUNQOzZCQUNpQixXQUFXO2NBQzFCLENBQUMsQ0FBQztnQkFDTixDQUFDO2FBQ0YsRUFDRCxPQUFPLENBQ1IsQ0FBQztTQUNIO2FBQ0ksSUFBRyxXQUFXLEtBQUssaUJBQWlCLEVBQUU7WUFDekMsRUFBRSxDQUFDLHdCQUF3QixDQUN6QjtnQkFDRSxJQUFJLEVBQUUsTUFBTSxjQUFjLElBQUksWUFBWSxFQUFFO2dCQUM1QyxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxXQUFXLEVBQUUsR0FBRyxFQUFFO29CQUNoQixFQUFFLENBQUMsU0FBUyxDQUFDLG1DQUNYLElBQUksQ0FBQyxPQUFPLEdBQUcsbUJBQ2pCO3FCQUNTLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxHQUFHLFlBQVk7cUJBQzVDLElBQUksQ0FBQyxPQUFPOzsrQ0FHbkIsSUFBSSxDQUFDLE9BQ1AsYUFBYSxZQUFZOzZCQUNSLFdBQVc7Y0FDMUIsQ0FBQyxDQUFDO2dCQUNOLENBQUM7YUFDRixFQUNELE9BQU8sQ0FDUixDQUFDO1NBQ0g7SUFHSCxDQUFDO0lBRU0sd0JBQXdCLENBQzdCLFNBQWlCLEVBQ2pCLFFBQWdCLEVBQ2hCLGNBQXNCO1FBRXRCLElBQUk7YUFDRCxpQkFBaUIsQ0FBQyxpQ0FBaUMsU0FBUztlQUNwRCxJQUFJLENBQUMsT0FBTzttQkFDUixRQUFRO29CQUNQLFNBQVM7d0JBQ0wsY0FBYztPQUMvQixDQUFDLENBQUM7SUFDUCxDQUFDO0NBUUY7QUFySUQsMEJBcUlDIn0=