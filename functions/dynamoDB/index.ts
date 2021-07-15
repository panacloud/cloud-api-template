import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class DynamoDB extends CodeWriter {
  public initializeDynamodb(apiName: string , output:TextWriter) {
    const ts = new TypeScriptWriter(output)
    
    ts.writeVariableDeclaration({
      name:`${apiName}_table`,
      typeName:"dynamodb.Table",
      initializer:()=>{
          ` new dynamodb.Table(this, "${apiName}Table", {
            tableName: "${apiName}",
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            partitionKey:{
              name: "id",
              type: dynamodb.AttributeType.STRING,
            },
          });`
      }
    },"const")

  }

  public importDynamodb(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ['aws_dynamodb as dynamodb']);
  }

  public grantFullAccess(lambda: string) {
    this.writeLine(`table.grantFullAccess(${lambda}_lambdaFn);`);
  }
}
