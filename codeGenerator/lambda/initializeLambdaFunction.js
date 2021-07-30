"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY, LAMBDA_STYLE } = model;
if (LAMBDA_STYLE === "single lambda") {
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
        lambda.initializeLambdaFunction(output, LAMBDA_STYLE, () => {
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
else if (LAMBDA_STYLE === "multiple lambda") {
    if (model.type.Mutation) {
        Object.keys(model.type.Mutation).forEach((key) => {
            templating_1.Generator.generate({ outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts` }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.initializeLambdaFunction(writer, LAMBDA_STYLE);
            });
        });
    }
    if (model.type.Query) {
        Object.keys(model.type.Query).forEach((key) => {
            templating_1.Generator.generate({ outputFile: `../../../${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts` }, (writer) => {
                const lambda = new lambdaFunction_1.LambdaFunction(writer);
                lambda.initializeLambdaFunction(writer, LAMBDA_STYLE);
            });
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdGlhbGl6ZUxhbWJkYUZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5pdGlhbGl6ZUxhbWJkYUZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esc0RBQWtEO0FBQ2xELHNEQUF5RDtBQUN6RCwwRUFBdUU7QUFDdkUsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLFlBQVksRUFBRSxHQUFHLEtBQUssQ0FBQztBQUd2RCxJQUFHLFlBQVksS0FBSyxlQUFlLEVBQUU7SUFDbkMsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FDekIsRUFBRSxVQUFVLEVBQUUsWUFBWSxzQkFBc0IscUJBQXFCLEVBQUUsRUFDdkUsQ0FBQyxNQUFrQixFQUFFLEtBQVUsRUFBRSxFQUFFO1FBQ2pDLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsTUFBTSxNQUFNLEdBQUcsSUFBSSwrQkFBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLEtBQUssSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDaEMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQzFEO1FBRUQsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNuQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDMUQ7UUFDRCxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDZixFQUFFLENBQUMsaUJBQWlCLENBQUM7Ozs7O1NBS2xCLENBQUMsQ0FBQztRQUNMLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNmLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRTtZQUN6RCxLQUFLLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNoQyxFQUFFLENBQUMsaUJBQWlCLENBQUM7b0JBQ1gsR0FBRzsrQkFDUSxHQUFHO2FBQ3JCLENBQUMsQ0FBQzthQUNOO1lBQ0QsS0FBSyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbkMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO29CQUNYLEdBQUc7K0JBQ1EsR0FBRzthQUNyQixDQUFDLENBQUM7YUFDTjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUNGLENBQUM7Q0FDSDtLQUNJLElBQUcsWUFBWSxLQUFLLGlCQUFpQixFQUFFO0lBQzFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQy9DLHNCQUFTLENBQUMsUUFBUSxDQUNoQixFQUFFLFVBQVUsRUFBRSxZQUFZLHNCQUFzQixlQUFlLEdBQUcsS0FBSyxFQUFFLEVBQ3pFLENBQUMsTUFBa0IsRUFBRSxFQUFFO2dCQUNyQixNQUFNLE1BQU0sR0FBRyxJQUFJLCtCQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDeEQsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLENBQUMsQ0FBQztLQUNKO0lBRUQsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDNUMsc0JBQVMsQ0FBQyxRQUFRLENBQ2hCLEVBQUUsVUFBVSxFQUFFLFlBQVksc0JBQXNCLGVBQWUsR0FBRyxLQUFLLEVBQUUsRUFDekUsQ0FBQyxNQUFrQixFQUFFLEVBQUU7Z0JBQ3JCLE1BQU0sTUFBTSxHQUFHLElBQUksK0JBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQ0YsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUFDO0tBQ0o7Q0FDRiJ9