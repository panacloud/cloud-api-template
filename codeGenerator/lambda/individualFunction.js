"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY } = jsonObj;
const { lambdaStyle } = jsonObj.api;
if (lambdaStyle === "single") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kaXZpZHVhbEZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5kaXZpZHVhbEZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHNEQUFrRDtBQUNsRCwwRUFBdUU7QUFDdkUsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsT0FBTyxDQUFDO0FBQzNDLE1BQU0sRUFBRyxXQUFXLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRXJDLElBQUksV0FBVyxLQUFLLFFBQVEsRUFBRTtJQUM1QixVQUFJLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxJQUFJLDBDQUFFLEtBQUssRUFBRTtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDOUMsc0JBQVMsQ0FBQyxRQUFRLENBQ2hCO2dCQUNFLFVBQVUsRUFBRSxZQUFZLHNCQUFzQixlQUFlLEdBQUcsS0FBSzthQUN0RSxFQUNELENBQUMsTUFBa0IsRUFBRSxFQUFFO2dCQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLCtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNqRCxzQkFBUyxDQUFDLFFBQVEsQ0FDaEI7Z0JBQ0UsVUFBVSxFQUFFLFlBQVksc0JBQXNCLGVBQWUsR0FBRyxLQUFLO2FBQ3RFLEVBQ0QsQ0FBQyxNQUFrQixFQUFFLEVBQUU7Z0JBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksK0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7S0FDSjtDQUNGIn0=