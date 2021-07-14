import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Appsync extends CodeWriter {
  
  private apiName : string = "appsync_api"
  private ds : string = "ds_"
  
  public importAppsync(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_appsync as appsync"]);
  }

  public initializeAppsyncApi(name: string, output: TextWriter) {
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

  public appsyncDataSource( output: TextWriter, dataSourceName:string) {
    const ts = new TypeScriptWriter(output);
    this.ds = `ds_${dataSourceName}`
    ts.writeVariableDeclaration(
      {
        name: "servRole",
        typeName: "iam.Role",
        initializer: () => {
          ts.writeLine(`new iam.Role(this,'appsynServiceRole',{
          assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
         });`);
        },
      },
      "const"
    );

    ts.writeLine(`servRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['lambda:InvokeFunction'],
    }));`);

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
          serviceRoleArn:servRole.roleArn
         })`);
        },
      },
      "const"
    );
  }

  public lambdaDataSourceResolver(
    fieldName: string,
    typeName: string,
    dataSourceName:string
  ) {
    this.writeLineIndented(`new appsync.CfnResolver(this,"res",{
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
