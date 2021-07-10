import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { LambdaFunction } from "../../functions/lambda/lambdaFunction";
const path = require('path')
const USER_WORKING_DIRECTORY = path.resolve(".");
const jsonObj = require(`${USER_WORKING_DIRECTORY}/model.json`);

Object.keys(jsonObj.type.Query).forEach((key) => {
  Generator.generate(
    { outputFile: `${USER_WORKING_DIRECTORY}/panacloud/lambda-fns/${key}.ts` },
    (writer: TextWriter) => {
      const lambda = new LambdaFunction(writer);
      lambda.helloWorldFunction(key);
    }
  );
});

Object.keys(jsonObj.type.Mutation).forEach((key) => {
  Generator.generate(
    { outputFile: `${USER_WORKING_DIRECTORY}/panacloud/lambda-fns/${key}.ts` },
    (writer: TextWriter) => {
      const lambda = new LambdaFunction(writer);
      lambda.helloWorldFunction(key);
    }
  );
});
