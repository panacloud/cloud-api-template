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
        if (lambdaStyle === "single") {
            ts.writeVariableDeclaration({
                name: `ds_${dataSourceName}`,
                typeName: "appsync.CfnDataSource",
                initializer: () => {
                    ts.writeLine(`new appsync.CfnDataSource(this,'${this.apiName + "dataSourceGraphql"}',{
            name: '${dataSourceName}_dataSource',
            apiId: ${this.apiName}_appsync.attrApiId,
            type:"AWS_LAMBDA",
            lambdaConfig: {lambdaFunctionArn:${this.apiName}_lambdaFn.functionArn},
            serviceRoleArn:${serviceRole}_serviceRole.roleArn
           })`);
                },
            }, "const");
        }
        else if (lambdaStyle === "multiple") {
            ts.writeVariableDeclaration({
                name: `ds_${dataSourceName}_${functionName}`,
                typeName: "appsync.CfnDataSource",
                initializer: () => {
                    ts.writeLine(`new appsync.CfnDataSource(this,'${this.apiName + "dataSourceGraphql" + functionName}',{
            name: '${this.apiName}_dataSource_${functionName}',
            apiId: ${this.apiName}_appsync.attrApiId,
            type:"AWS_LAMBDA",
            lambdaConfig: {lambdaFunctionArn:${this.apiName}_lambdaFn_${functionName}.functionArn},
            serviceRoleArn:${serviceRole}_serviceRole.roleArn
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
    appsyncApiTest() {
        this.writeLine(`expect(actual).to(
      countResourcesLike("AWS::AppSync::GraphQLApi",1, {
        AuthenticationType: "API_KEY",
        Name: "${this.apiName}",
      })
    );`);
        this.writeLine();
        this.writeLine(`expect(actual).to(
      countResourcesLike("AWS::AppSync::GraphQLSchema",1, {
        ApiId: {
          "Fn::GetAtt": [
            "${this.apiName}",
             "ApiId"
          ],
        },
      })
    );`);
    }
    appsyncApiKeyTest() {
        this.writeLine(`expect(actual).to(
      haveResource("AWS::AppSync::ApiKey", {
        ApiId: {
          "Fn::GetAtt": ["${this.apiName}", "ApiId"],
        },
      })
    );
  `);
    }
    appsyncDatasourceTest(dataSourceName, lambdaFuncIndex) {
        this.writeLine();
        this.writeLine(`expect(actual).to(
      countResourcesLike("AWS::AppSync::DataSource",1, {
          ApiId: {
            "Fn::GetAtt": ["${this.apiName}", "ApiId"],
          },
          Name: "${dataSourceName}",
          Type: "AWS_LAMBDA",
          LambdaConfig: {
            LambdaFunctionArn: {
              "Fn::GetAtt": [
                stack.getLogicalId(
                  lambda_func[${lambdaFuncIndex}].node.defaultChild as cdk.CfnElement
                ),
                "Arn",
              ],
            },
          },
          ServiceRoleArn: {
            "Fn::GetAtt": [
              stack.getLogicalId(role[0].node.defaultChild as cdk.CfnElement),
              "Arn",
            ],
          },
        })
      );`);
    }
    appsyncResolverTest(fieldName, typeName, dataSourceName) {
        this.writeLine(`expect(actual).to(
      countResourcesLike("AWS::AppSync::Resolver",1, {
          "ApiId": {
              "Fn::GetAtt": [
                "${this.apiName}",
                "ApiId"
              ]
            },
            "FieldName": "${fieldName}",
            "TypeName": "${typeName}",    
            "DataSourceName": "${dataSourceName}"
        })
    );`);
    }
}
exports.Appsync = Appsync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsT0FBUSxTQUFRLGlCQUFVO0lBQXZDOztRQUNTLFlBQU8sR0FBVyxhQUFhLENBQUM7UUFnTXZDLDJEQUEyRDtRQUMzRCx1REFBdUQ7UUFDdkQsNEJBQTRCO1FBQzVCLDZCQUE2QjtRQUM3QixXQUFXO1FBQ1gsSUFBSTtJQUNOLENBQUM7SUFyTUMsNkJBQTZCO0lBRXRCLGFBQWEsQ0FBQyxNQUFrQjtRQUNyQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFTSxvQkFBb0IsQ0FDekIsSUFBWSxFQUNaLE1BQWtCLEVBQ2xCLGtCQUEyQjtRQUUzQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyx3QkFBd0IsQ0FDekI7WUFDRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxVQUFVO1lBQy9CLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsV0FBVyxFQUFFLEdBQUcsRUFBRTtnQkFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxtQ0FBbUMsSUFBSSxDQUFDLE9BQU87O21CQUVuRCxJQUFJLENBQUMsT0FBTztXQUNwQixDQUFDLENBQUM7WUFDTCxDQUFDO1NBQ0YsRUFDRCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7SUFFTSx1QkFBdUIsQ0FBQyxNQUFjLEVBQUUsTUFBa0I7UUFDL0QsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztR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