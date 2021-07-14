"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDB = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class DynamoDB extends core_1.CodeWriter {
    initializeDynamodb(name) {
        this.writeLineIndented(`const table = new dynamodb.Table(this, "${name}", {
        tableName: "${name}",
        billingMode: ddb.BillingMode.PAY_PER_REQUEST,
        partitionKey: {
          name: "id",
          type: ddb.AttributeType.STRING,
        },
      });`);
    }
    importDynamodb(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ['aws_dynamodb as dynamodb']);
    }
    grantFullAccess(lambda) {
        this.writeLine(`table.grantFullAccess(${lambda});`);
    }
}
exports.DynamoDB = DynamoDB;
