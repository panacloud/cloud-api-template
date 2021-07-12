import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { LambdaFunction } from "../../functions/lambda/lambdaFunction";
const jsonObj = require("../../utils/models.json");

Object.keys(jsonObj.type.Query).forEach((key) => {
  Generator.generate(
    { outputFile: `../../../panacloud/lambda-fns/${key}.ts` },
    (writer: TextWriter) => {
      const lambda = new LambdaFunction(writer);
      lambda.helloWorldFunction(key);
    }
  );
});

Object.keys(jsonObj.type.Mutation).forEach((key) => {
  Generator.generate(
    { outputFile: `../../../panacloud/lambda-fns/${key}.ts` },
    (writer: TextWriter) => {
      const lambda = new LambdaFunction(writer);
      lambda.helloWorldFunction(key);
    }
  );
});
