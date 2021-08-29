import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { LambdaFunction } from "../../Constructs/Lambda/lambdaFunction";
import { APITYPE, LAMBDASTYLE, PATH } from "../../util/constant";
const SwaggerParser = require("@apidevtools/swagger-parser");
const model = require(`../../model.json`);
const { lambdaStyle, apiType } = model.api;

if (apiType === APITYPE.graphql) {
  if (lambdaStyle === LAMBDASTYLE.single) {
    if (model?.type?.Query) {
      Object.keys(model.type.Query).forEach((key) => {
        Generator.generate(
          {
            outputFile: `${PATH.lambda}${key}.ts`,
          },
          (writer: TextWriter) => {
            const lambda = new LambdaFunction(writer);
            lambda.helloWorldFunction(key);
          }
        );
      });
    }

    if (model.type.Mutation) {
      Object.keys(model.type.Mutation).forEach((key) => {
        Generator.generate(
          {
            outputFile: `${PATH.lambda}${key}.ts`,
          },
          (writer: TextWriter) => {
            const lambda = new LambdaFunction(writer);
            lambda.helloWorldFunction(key);
          }
        );
      });
    }
  }
} else {
  SwaggerParser.validate(model.openApiDef, (err: any, api: any) => {
    if (err) {
      console.error(err);
    } else {
      Object.keys(api.paths).forEach((path) => {
        for (var methodName in api.paths[`${path}`]) {
          let lambdaFunctionFile =
            api.paths[`${path}`][`${methodName}`][`operationId`];
          Generator.generate(
            {
              outputFile: `${PATH.lambda}${lambdaFunctionFile}.ts`,
            },
            (writer: TextWriter) => {
              const lambda = new LambdaFunction(writer);
              lambda.helloWorldFunction(lambdaFunctionFile);
            }
          );
        }
      });
    }
  });
}
