"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoDB = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
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
        if (lambdaStyle === "single") {
            this.writeLine(`${tableName}.grantFullAccess(${lambda}_lambdaFn);`);
        }
        else if (lambdaStyle === "multiple") {
            this.writeLine(`${tableName}.grantFullAccess(${lambda}_lambdaFn_${functionName});`);
        }
    }
}
exports.DynamoDB = DynamoDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsUUFBUyxTQUFRLGlCQUFVO0lBQy9CLGNBQWMsQ0FBQyxNQUFrQjtRQUN0QyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFTSxrQkFBa0IsQ0FBQyxPQUFlLEVBQUUsTUFBa0I7UUFDM0QsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsd0JBQXdCLENBQ3pCO1lBQ0UsSUFBSSxFQUFFLEdBQUcsT0FBTyxRQUFRO1lBQ3hCLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsV0FBVyxFQUFFLEdBQUcsRUFBRTtnQkFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsT0FBTzt3QkFDcEMsT0FBTzs7Ozs7O1lBTW5CLENBQUMsQ0FBQztZQUNOLENBQUM7U0FDRixFQUNELE9BQU8sQ0FDUixDQUFDO0lBQ0osQ0FBQztJQUVNLGVBQWUsQ0FDcEIsTUFBYyxFQUNkLFNBQWlCLEVBQ2pCLFdBQW1CLEVBQ25CLFlBQXFCO1FBRXJCLElBQUksV0FBVyxLQUFLLFFBQVEsRUFBRTtZQUM1QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxvQkFBb0IsTUFBTSxhQUFhLENBQUMsQ0FBQztTQUNyRTthQUFNLElBQUksV0FBVyxLQUFLLFVBQVUsRUFBRTtZQUNyQyxJQUFJLENBQUMsU0FBUyxDQUNaLEdBQUcsU0FBUyxvQkFBb0IsTUFBTSxhQUFhLFlBQVksSUFBSSxDQUNwRSxDQUFDO1NBQ0g7SUFDSCxDQUFDO0NBQ0Y7QUF6Q0QsNEJBeUNDIn0=