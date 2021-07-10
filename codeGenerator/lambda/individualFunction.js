"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const jsonObj = require("../../../model.json");
Object.keys(jsonObj.type.Query).forEach((key) => {
    templating_1.Generator.generate({ outputFile: `../../../panacloud/lambda-fns/${key}.ts` }, (writer) => {
        const lambda = new lambdaFunction_1.LambdaFunction(writer);
        lambda.helloWorldFunction(key);
    });
});
Object.keys(jsonObj.type.Mutation).forEach((key) => {
    templating_1.Generator.generate({ outputFile: `../../../panacloud/lambda-fns/${key}.ts` }, (writer) => {
        const lambda = new lambdaFunction_1.LambdaFunction(writer);
        lambda.helloWorldFunction(key);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kaXZpZHVhbEZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5kaXZpZHVhbEZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esc0RBQWtEO0FBQ2xELDBFQUF1RTtBQUN2RSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUUvQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDOUMsc0JBQVMsQ0FBQyxRQUFRLENBQ2hCLEVBQUUsVUFBVSxFQUFFLGlDQUFpQyxHQUFHLEtBQUssRUFBRSxFQUN6RCxDQUFDLE1BQWtCLEVBQUUsRUFBRTtRQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLCtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUM7QUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDakQsc0JBQVMsQ0FBQyxRQUFRLENBQ2hCLEVBQUUsVUFBVSxFQUFFLGlDQUFpQyxHQUFHLEtBQUssRUFBRSxFQUN6RCxDQUFDLE1BQWtCLEVBQUUsRUFBRTtRQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLCtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMifQ==