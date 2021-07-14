import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class DynamoDB extends CodeWriter {
  public initializeDynamodb(name: string) {
    this.writeLineIndented(`const table = new dynamodb.Table(this, "${name}", {
        tableName: "${name}",
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: "id",
          type: ddb.AttributeType.STRING,
        },
      });`);
  }
  public importDynamodb(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ['aws_dynamodb as dynamodb']);
  }
  public grantFullAccess(lambda: string) {
    this.writeLine(`table.grantFullAccess(${lambda});`);
  }
}
