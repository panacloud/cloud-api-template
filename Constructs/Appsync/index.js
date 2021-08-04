"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appsync = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
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
    appsyncLambdaDataSource(output, dataSourceName, serviceRole, lambdaStyle, functionName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        let ds_initializerName = this.apiName + "dataSourceGraphql";
        let ds_variable = `ds_${dataSourceName}`;
        let ds_name = `${dataSourceName}_dataSource`;
        let lambdaFunctionArn = `props!.${this.apiName}_lambdaFnArn`;
        if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
            ds_initializerName = this.apiName + "dataSourceGraphql" + functionName;
            ds_variable = `ds_${dataSourceName}_${functionName}`;
            ds_name = `${this.apiName}_dataSource_${functionName}`;
            lambdaFunctionArn = `props!.${this.apiName}_lambdaFn_${functionName}Arn`;
        }
        ts.writeVariableDeclaration({
            name: ds_variable,
            typeName: "appsync.CfnDataSource",
            initializer: () => {
                ts.writeLine(`new appsync.CfnDataSource(this,'${ds_initializerName}',{
          name: "${ds_name}",
          apiId: ${this.apiName}_appsync.attrApiId,
          type:"AWS_LAMBDA",
          lambdaConfig: {lambdaFunctionArn:${lambdaFunctionArn}},
          serviceRoleArn:${serviceRole}_serviceRole.roleArn
         })`);
            },
        }, "const");
        // if (lambdaStyle === LAMBDA.single) {
        //   ds_initializerName = this.apiName + "dataSourceGraphql"
        //   ds_variable = `ds_${dataSourceName}`
        //   ds_name = `${dataSourceName}_dataSource`
        //   lambdaFunctionArn = `${this.apiName}_lambdaFn`
        // }
        // if (lambdaStyle === LAMBDA.single) {
        //   ts.writeVariableDeclaration(
        //     {
        //       name: `ds_${dataSourceName}`,
        //       typeName: "appsync.CfnDataSource",
        //       initializer: () => {
        //         ts.writeLine(`new appsync.CfnDataSource(this,'${
        //           this.apiName + "dataSourceGraphql"
        //         }',{
        //         name: '${dataSourceName}_dataSource',
        //         apiId: ${this.apiName}_appsync.attrApiId,
        //         type:"AWS_LAMBDA",
        //         lambdaConfig: {lambdaFunctionArn:${this.apiName}_lambdaFn.functionArn},
        //         serviceRoleArn:${serviceRole}_serviceRole.roleArn
        //        })`);
        //       },
        //     },
        //     "const"
        //   );
        // } else if (lambdaStyle === LAMBDA.multiple) {
        //   ts.writeVariableDeclaration(
        //     {
        //       name: `ds_${dataSourceName}_${functionName}`,
        //       typeName: "appsync.CfnDataSource",
        //       initializer: () => {
        //         ts.writeLine(`new appsync.CfnDataSource(this,'${
        //           this.apiName + "dataSourceGraphql" + functionName
        //         }',{
        //         name: '${this.apiName}_dataSource_${functionName}',
        //         apiId: ${this.apiName}_appsync.attrApiId,
        //         type:"AWS_LAMBDA",
        //         lambdaConfig: {lambdaFunctionArn:${this.apiName}_lambdaFn_${functionName}.functionArn},
        //         serviceRoleArn:${serviceRole}_serviceRole.roleArn
        //        })`);
        //       },
        //     },
        //     "const"
        //   );
        // }
    }
    appsyncLambdaResolver(fieldName, typeName, dataSourceName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${fieldName}_resolver`,
            typeName: "appsync.CfnResolver",
            initializer: () => {
                this.writeLineIndented(`new appsync.CfnResolver(this,'${fieldName}_resolver',{
            apiId: "${this.apiName}_appsync.attrApiId",
            typeName: "${typeName}",
            fieldName: "${fieldName}",
            dataSourceName: ${dataSourceName}.name
        })`);
            },
        }, "const");
        // this.writeLineIndented(`new appsync.CfnResolver(this,'${fieldName}_resolver',{
        //     apiId: ${this.apiName}_appsync.attrApiId,
        //     typeName: "${typeName}",
        //     fieldName: "${fieldName}",
        //     dataSourceName: ${dataSourceName}.name
        // })`);
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
