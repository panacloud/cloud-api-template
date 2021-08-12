import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { LambdaFunction } from "../../Constructs/Lambda/lambdaFunction";
import { APITYPE, LAMBDA } from "../../cloud-api-constants";
const jsonObj = require(`../../model.json`);
const { lambdaStyle, apiType } = jsonObj.api;

if (lambdaStyle === LAMBDA.single && apiType === APITYPE.graphql) {
  if (jsonObj?.type?.Query) {
    Object.keys(jsonObj.type.Query).forEach((key) => {
      Generator.generate(
        {
          outputFile: `../../../../lambda-fns/${key}.ts`,
        },
        (writer: TextWriter) => {
          const lambda = new LambdaFunction(writer);
          lambda.helloWorldFunction(key);
        }
      );
    });
  }

  if (jsonObj.type.Mutation) {
    Object.keys(jsonObj.type.Mutation).forEach((key) => {
      Generator.generate(
        {
          outputFile: `../../../../lambda-fns/${key}.ts`,
        },
        (writer: TextWriter) => {
          const lambda = new LambdaFunction(writer);
          lambda.helloWorldFunction(key);
        }
      );
    });
  }
}