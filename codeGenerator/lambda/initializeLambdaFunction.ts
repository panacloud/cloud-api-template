import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LambdaFunction } from "../../functions/lambda/lambdaFunction";
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY, LAMBDA_STYLE } = model;


if(LAMBDA_STYLE === "single lambda") {
  Generator.generateFromModel(
    { outputFile: `../../../../lambda-fns/main.ts` },
    (output: TextWriter, model: any) => {
      const ts = new TypeScriptWriter(output);
      const lambda = new LambdaFunction(output);
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
    }
  );
}
else if(LAMBDA_STYLE === "multiple lambda") {
  if (model.type.Mutation) {
    Object.keys(model.type.Mutation).forEach((key) => {
      Generator.generate(
        { outputFile: `../../../../lambda-fns/${key}.ts` },
        (writer: TextWriter) => {
          const lambda = new LambdaFunction(writer);
          lambda.initializeLambdaFunction(writer, LAMBDA_STYLE);
        }
      );
    });
  }
  
  if (model.type.Query) {
    Object.keys(model.type.Query).forEach((key) => {
      Generator.generate(
        { outputFile: `../../../../lambda-fns/${key}.ts` },
        (writer: TextWriter) => {
          const lambda = new LambdaFunction(writer);
          lambda.initializeLambdaFunction(writer, LAMBDA_STYLE);
        }
      );
    });
  }
}




