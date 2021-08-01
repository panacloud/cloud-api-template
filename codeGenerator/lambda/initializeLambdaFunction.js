"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { lambdaStyle } = model.api;
if (lambdaStyle === "single") {
    templating_1.Generator.generateFromModel({ outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/main.ts` }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const lambda = new lambdaFunction_1.LambdaFunction(output);
        for (var key in model.type.Query) {
            lambda.importIndividualFunction(output, key, `./${key}`);
        }
        for (var key in model.type.Mutation) {
            lambda.importIndividualFunction(output, key, `./${key}`);
        }
        ts.writeLine();
        ts.writeLineIndented(`
      type Event = {
          info: {
            fieldName: string
         }
       }`);
        ts.writeLine();
        lambda.initializeLambdaFunction(output, lambdaStyle, () => {
            for (var key in model.type.Query) {
                ts.writeLineIndented(`
            case "${key}":
                return await ${key}();
            `);
            }
            for (var key in model.type.Mutation) {
                ts.writeLineIndented(`
            case "${key}":
                return await ${key}();
            `);
            }
        });
    });
}
else if (lambdaStyle === "multiple") {
    if (model.type.Mutation) {
        Object.keys(model.type.Mutation).forEach((key) => {
            templating_1.Generator.generate({
                outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts`,
            }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.initializeLambdaFunction(writer, lambdaStyle);
            });
        });
    }
    if (model.type.Query) {
        Object.keys(model.type.Query).forEach((key) => {
            templating_1.Generator.generate({
                outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts`,
            }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.initializeLambdaFunction(writer, lambdaStyle);
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6ZUxhbWJkYUZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5pdGlhbGl6ZUxhbWJkYUZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esc0RBQWtEO0FBQ2xELHNEQUF5RDtBQUN6RCwwRUFBdUU7QUFDdkUsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsS0FBSyxDQUFDO0FBQ3pDLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBRWxDLElBQUksV0FBVyxLQUFLLFFBQVEsRUFBRTtJQUM1QixzQkFBUyxDQUFDLGlCQUFpQixDQUN6QixFQUFFLFVBQVUsRUFBRSxZQUFZLHNCQUFzQixxQkFBcUIsRUFBRSxFQUN2RSxDQUFDLE1BQWtCLEVBQUUsS0FBVSxFQUFFLEVBQUU7UUFDakMsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLCtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNoQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDMUQ7UUFFRCxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ25DLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQztTQUMxRDtRQUNELEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNmLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQzs7Ozs7U0FLbEIsQ0FBQyxDQUFDO1FBQ0wsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxFQUFFO1lBQ3hELEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDWCxHQUFHOytCQUNRLEdBQUc7YUFDckIsQ0FBQyxDQUFDO2FBQ047WUFDRCxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNuQyxFQUFFLENBQUMsaUJBQWlCLENBQUM7b0JBQ1gsR0FBRzsrQkFDUSxHQUFHO2FBQ3JCLENBQUMsQ0FBQzthQUNOO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQ0YsQ0FBQztDQUNIO0tBQU0sSUFBSSxXQUFXLEtBQUssVUFBVSxFQUFFO0lBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQy9DLHNCQUFTLENBQUMsUUFBUSxDQUNoQjtnQkFDRSxVQUFVLEVBQUUsWUFBWSxzQkFBc0IsZUFBZSxHQUFHLEtBQUs7YUFDdEUsRUFDRCxDQUFDLE1BQWtCLEVBQUUsRUFBRTtnQkFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSwrQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUVELElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQzVDLHNCQUFTLENBQUMsUUFBUSxDQUNoQjtnQkFDRSxVQUFVLEVBQUUsWUFBWSxzQkFBc0IsZUFBZSxHQUFHLEtBQUs7YUFDdEUsRUFDRCxDQUFDLE1BQWtCLEVBQUUsRUFBRTtnQkFDckIsTUFBTSxNQUFNLEdBQUcsSUFBSSwrQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMxQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZELENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7S0FDSjtDQUNGIn0=