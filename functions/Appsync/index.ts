import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Appsync extends CodeWriter {
  
  public apiName : string = "appsync_api"
  public ds : string = "ds_"
  
  public importAppsync(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_appsync as appsync"]);
  }

  public initializeAppsyncApi(name: string, output: TextWriter, authenticationType?:string) {
    this.apiName = name
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${this.apiName}_appsync`,
        typeName: "appsync.CfnGraphQLApi",
        initializer: () => {
          ts.writeLine(`new appsync.CfnGraphQLApi(this,'${this.apiName}',{
          authenticationType:'API_KEY',
          name: '${this.apiName}',
        })`);
        },
      },
      "const"
    );
  }

  public initializeAppsyncSchema(schema:string,output:TextWriter){
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${this.apiName}_schema`,
        typeName: "appsync.CfnGraphQLSchema",
        initializer: () => {
          ts.writeLine(`new appsync.CfnGraphQLSchema(this,'${this.apiName}Schema',{
            apiId: ${this.apiName}_appsync.attrApiId,
            definition:${schema}
          })`);
        },
      },
      "const"
    );
  }

  public initializeApiKeyForAppsync(apiName :string){
      this.writeLine(`new appsync.CfnApiKey(this,"apiKey",{
        apiId:${apiName}_appsync.attrApiId
      })`)
  }

  public appsyncDataSource( output: TextWriter, dataSourceName:string, serviceRole:string) {
    const ts = new TypeScriptWriter(output);
    this.ds = `ds_${dataSourceName}`
    ts.writeVariableDeclaration(
      {
        name: `ds_${dataSourceName}`,
        typeName: "appsync.CfnDataSource",
        initializer: () => {
          ts.writeLine(`new appsync.CfnDataSource(this,'${this.apiName+"dataSourceGraphql"}',{
          name: '${this.apiName+dataSourceName}',
          apiId: ${this.apiName}_appsync.attrApiId,
          type:"AWS_LAMBDA",
          lambdaConfig: {lambdaFunctionArn:${this.apiName}_lambdaFn.functionArn},
          serviceRoleArn:${serviceRole}.roleArn
         })`);
        },
      },
      "const"
    );
  }

  public lambdaDataSourceResolver(
    fieldName: string,
    typeName: string,
    dataSourceName?:string
  ) {
    this.writeLineIndented(`new appsync.CfnResolver(this,${fieldName}_resolver,{
      apiId: ${this.apiName}_appsync.attrApiId,
      typeName: "${typeName}",
      fieldName: "${fieldName}",
      dataSourceName: ${this.ds}.name
    })`);
  }

  // public lambdaDataSourceResolverMutation(value: string) {
  //   this.writeLineIndented(` lambdaDs.createResolver({
  //     typeName: "Mutation",
  //     fieldName: "${value}",
  //   });`);
  // }
}
