import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LAMBDASTYLE } from "../../constant";

export class DynamoDB extends CodeWriter {

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
          }
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
    if (lambdaStyle === LAMBDASTYLE.single) {
      this.writeLine(
        `${tableName}.grantFullAccess(props!.${lambda}_lambdaFn);`
      );
    } else if (lambdaStyle === LAMBDASTYLE.multi) {
      this.writeLine(
        `${tableName}.grantFullAccess(props!.${lambda}_lambdaFn_${functionName});`
      );
    }
  }

  public dbConstructLambdaAccess(
    apiName: string,
    dbConstructName: string,
    lambdaConstructName: string,
    lambdaStyle: string,
    functionName?: string
  ) {
    if (lambdaStyle === LAMBDASTYLE.single) {
      this.writeLine(
        `${dbConstructName}.table.grantFullAccess(${lambdaConstructName}.${apiName}_lambdaFn);`
      );
    } else if (lambdaStyle === LAMBDASTYLE.multi) {
      this.writeLine(
        `${dbConstructName}.table.grantFullAccess(${lambdaConstructName}.${apiName}_lambdaFn_${functionName});`
      );
    }
  }

  public initializeTestForDynamodb(TableName: string) {
    this.writeLine(`expect(actual).to(
      countResourcesLike("AWS::DynamoDB::Table",1, {
        KeySchema: [
          {
            AttributeName: "id",
            KeyType: "HASH",
          },
        ],
        AttributeDefinitions: [
          {
            AttributeName: "id",
            AttributeType: "S",
          },
        ],
        BillingMode: "PAY_PER_REQUEST",
        TableName: "${TableName}",
      })
    );
  `);
  }
}
