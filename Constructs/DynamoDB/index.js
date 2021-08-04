"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDB = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
class DynamoDB extends core_1.CodeWriter {
    importDynamodb(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_dynamodb as dynamodb"]);
    }
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
          },
        });`);
            },
        }, "const");
    }
    grantFullAccess(lambda, tableName, lambdaStyle, functionName) {
        if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
            this.writeLine(`${tableName}.grantFullAccess(props!.${lambda}_lambdaFn);`);
        }
        else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
            this.writeLine(`${tableName}.grantFullAccess(props!.${lambda}_lambdaFn_${functionName});`);
        }
    }
}
exports.DynamoDB = DynamoDB;
