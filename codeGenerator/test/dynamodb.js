"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const constructsTest_1 = require("../../functions/constructsTest");
const dynamoDB_1 = require("../../functions/dynamoDB");
const model = require(`../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
if (((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.database) === "DynamoDB") {
    templating_1.Generator.generate({ outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-dynamodb.test.ts`, }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new constructsTest_1.TestingConstructs(output);
        const dynodb = new dynamoDB_1.DynamoDB(output);
        testClass.ImportsForTest(output);
        ts.writeLine();
        testClass.initializeTest("Dynamodb Constructs Test", () => {
            var _a;
            ts.writeLine();
            dynodb.initializeTestForDynamodb((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.apiName);
        }, output);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1vZGIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkeW5hbW9kYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxzREFBa0Q7QUFDbEQsc0RBQXlEO0FBQ3pELG1FQUFtRTtBQUNuRSx1REFBb0Q7QUFDcEQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsS0FBSyxDQUFDO0FBRXpDLElBQUcsT0FBQSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsR0FBRywwQ0FBRSxRQUFRLE1BQUssVUFBVSxFQUFDO0lBQ25DLHNCQUFTLENBQUMsUUFBUSxDQUFDLEVBQUMsVUFBVSxFQUFDLFlBQVksc0JBQXNCLFNBQVMsc0JBQXNCLG1CQUFtQixHQUFFLEVBQ3JILENBQUMsTUFBa0IsRUFBRSxFQUFFO1FBQ3JCLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxrQ0FBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUMvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbkMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUNoQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUE7UUFDZCxTQUFTLENBQUMsY0FBYyxDQUFDLDBCQUEwQixFQUFDLEdBQUUsRUFBRTs7WUFDdEQsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFBO1lBQ2QsTUFBTSxDQUFDLHlCQUF5QixPQUFDLEtBQUssYUFBTCxLQUFLLHVCQUFMLEtBQUssQ0FBRSxHQUFHLDBDQUFFLE9BQU8sQ0FBQyxDQUFBO1FBQ3ZELENBQUMsRUFBQyxNQUFNLENBQUMsQ0FBQTtJQUNYLENBQUMsQ0FBQyxDQUFBO0NBQ0gifQ==