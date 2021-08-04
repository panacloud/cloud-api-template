import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LAMBDA } from "../../cloud-api-constants";

export class DynamoDB extends CodeWriter {
  public importDynamodb(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_dynamodb as dynamodb"]);
  }

  public initializeDynamodb(apiName: string, output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_table`,
        typeName: "dynamodb.Table",
        initializer: () => {
          ts.writeLine(` new dynamodb.Table(this, "${apiName}Table", {
          tableName: "${apiName}",
          billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
          partitionKey:{
            name: "id",
            type: dynamodb.AttributeType.STRING,
          },
        });`);
        },
      },
      "const"
    );
  }

  public grantFullAccess(
    lambda: string,
    tableName: string,
    lambdaStyle: string,
    functionName?: string
  ) {
    if (lambdaStyle === LAMBDA.single) {
      this.writeLine(`props.${tableName}.grantFullAccess(props.${lambda}_lambdaFn);`);
    } else if (lambdaStyle === LAMBDA.multiple) {
      this.writeLine(
        `${tableName}.grantFullAccess(props.${lambda}_lambdaFn_${functionName});`
      );
    }
  }
}
