"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDB = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../util/constant");
class DynamoDB extends core_1.CodeWriter {
    initializeDynamodb(apiName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
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
        }, "const");
    }
    grantFullAccess(lambda, tableName, lambdaStyle, functionName) {
        if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
            this.writeLine(`${tableName}.grantFullAccess(props!.${lambda}_lambdaFn);`);
        }
        else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
            this.writeLine(`${tableName}.grantFullAccess(props!.${lambda}_lambdaFn_${functionName});`);
        }
    }
    dbConstructLambdaAccess(apiName, dbConstructName, lambdaConstructName, lambdaStyle, apiType, functionName) {
        if (lambdaStyle === constant_1.LAMBDASTYLE.single || apiType === constant_1.APITYPE.rest) {
            this.writeLine(`${dbConstructName}.table.grantFullAccess(${lambdaConstructName}.${apiName}_lambdaFn);`);
        }
        else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
            this.writeLine(`${dbConstructName}.table.grantFullAccess(${lambdaConstructName}.${apiName}_lambdaFn_${functionName});`);
        }
    }
    initializeTestForDynamodb(TableName) {
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
exports.DynamoDB = DynamoDB;
