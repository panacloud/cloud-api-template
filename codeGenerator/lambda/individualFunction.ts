import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { LambdaFunction } from "../../functions/lambda/lambdaFunction";
const path = require('path')
const {USER_WORKING_DIRECTORY} = require('../../model.json')
const jsonObj = require(`../../model.json`);
const generatePath = path.relative(path.resolve('.'), `/${USER_WORKING_DIRECTORY}`)

Object.keys(jsonObj.type.Query).forEach((key) => {
  Generator.generate(
    { outputFile: `${generatePath}/lambda-fns/${key}.ts` },
    (writer: TextWriter) => {
      const lambda = new LambdaFunction(writer);
      lambda.helloWorldFunction(key);
      console.log("USER_WORKING_DIRECTORY  1===>",USER_WORKING_DIRECTORY)
    }
  );
});

Object.keys(jsonObj.type.Mutation).forEach((key) => {
  Generator.generate(
    { outputFile: `${USER_WORKING_DIRECTORY}/lambda-fns/${key}.ts` },
    (writer: TextWriter) => {
      const lambda = new LambdaFunction(writer);
      lambda.helloWorldFunction(key);
    }
  );
});
