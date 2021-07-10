import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LambdaFunction } from "../../functions/lambda/lambdaFunction";
const path = require('path')
const {USER_WORKING_DIRECTORY} = require('../../model.json')

const generatePath = path.relative(path.resolve('.'), `/${USER_WORKING_DIRECTORY}`)

Generator.generateFromModel(
  { outputFile: `${generatePath}/lambda-fns/main.ts` },
  (output: TextWriter, model: any) => {
    const ts = new TypeScriptWriter(output);
    const lambda = new LambdaFunction(output);
    console.log("USER_WORKING_DIRECTORY  2===>",USER_WORKING_DIRECTORY)
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
    lambda.initializeLambdaFunction(() => {
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
    }, output);
  }
);
