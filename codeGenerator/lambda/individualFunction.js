"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY, LAMBDA_STYLE } = jsonObj;
if (LAMBDA_STYLE === "single lambda") {
    if ((_a = jsonObj === null || jsonObj === void 0 ? void 0 : jsonObj.type) === null || _a === void 0 ? void 0 : _a.Query) {
        Object.keys(jsonObj.type.Query).forEach((key) => {
            templating_1.Generator.generate({
                outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts`,
            }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.helloWorldFunction(key);
            });
        });
    }
    if (jsonObj.type.Mutation) {
        Object.keys(jsonObj.type.Mutation).forEach((key) => {
            templating_1.Generator.generate({
                outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts`,
            }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.helloWorldFunction(key);
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kaXZpZHVhbEZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5kaXZpZHVhbEZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHNEQUFrRDtBQUNsRCwwRUFBdUU7QUFDdkUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLFlBQVksRUFBRSxHQUFHLE9BQU8sQ0FBQztBQUV6RCxJQUFJLFlBQVksS0FBSyxlQUFlLEVBQUU7SUFDcEMsVUFBSSxPQUFPLGFBQVAsT0FBTyx1QkFBUCxPQUFPLENBQUUsSUFBSSwwQ0FBRSxLQUFLLEVBQUU7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzlDLHNCQUFTLENBQUMsUUFBUSxDQUNoQjtnQkFDRSxVQUFVLEVBQUUsWUFBWSxzQkFBc0IsZUFBZSxHQUFHLEtBQUs7YUFDdEUsRUFDRCxDQUFDLE1BQWtCLEVBQUUsRUFBRTtnQkFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSwrQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztLQUNKO0lBRUQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDakQsc0JBQVMsQ0FBQyxRQUFRLENBQ2hCO2dCQUNFLFVBQVUsRUFBRSxZQUFZLHNCQUFzQixlQUFlLEdBQUcsS0FBSzthQUN0RSxFQUNELENBQUMsTUFBa0IsRUFBRSxFQUFFO2dCQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLCtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0tBQ0o7Q0FDRiJ9