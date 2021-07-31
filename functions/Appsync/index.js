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
            name: '${dataSourceName}_dataSource',
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
            name: '${this.apiName}_dataSource',
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
        this.writeLineIndented(`new appsync.CfnResolver(this,'${fieldName}_resolver',{
        apiId: ${this.apiName}_appsync.attrApiId,
        typeName: "${typeName}",
        fieldName: "${fieldName}",
        dataSourceName: ${dataSourceName}.name
      })`);
    }
    appsyncApiTest() {
        this.writeLine(`expect(actual).to(
      haveResource("AWS::AppSync::GraphQLApi", {
        AuthenticationType: "API_KEY",
        Name: "${this.apiName}",
      })
    );`);
        this.writeLine();
        this.writeLine(`expect(actual).to(
      haveResource("AWS::AppSync::GraphQLSchema", {
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
    appsyncDatasourceTest() {
        this.writeLine();
        this.writeLine(`expect(actual).to(
        haveResource("AWS::AppSync::DataSource", {
          ApiId: {
            "Fn::GetAtt": ["${this.apiName}", "ApiId"],
          },
          Name: "${this.apiName}_dataSource",
          Type: "AWS_LAMBDA",
          LambdaConfig: {
            LambdaFunctionArn: {
              "Fn::GetAtt": [
                stack.getLogicalId(
                  lambda_func[0].node.defaultChild as cdk.CfnElement
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
    appsyncResolverTest() {
        this.writeLine(`expect(actual).to(
      haveResource("AWS::AppSync::Resolver", {
          "ApiId": {
              "Fn::GetAtt": [
                "${this.apiName}",
                "ApiId"
              ]
            },
          "DataSourceName": "${this.apiName}_dataSource"
        })
    );`);
    }
}
exports.Appsync = Appsync;
