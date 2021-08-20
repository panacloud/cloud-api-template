import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { LambdaFunction } from "../../Constructs/Lambda/lambdaFunction";
import { APITYPE, LAMBDA } from "../../cloud-api-constants";
const SwaggerParser = require('@apidevtools/swagger-parser');
const jsonObj = require(`../../model.json`);
// const openApi = require("../../schema.json")s
const { lambdaStyle, apiType } = jsonObj.api;

if (apiType === APITYPE.graphql) {
  if(lambdaStyle === LAMBDA.single) {
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
}
else {
  SwaggerParser.validate(jsonObj.openApiDef, (err: any, api: any) => {
    if (err) {
      console.error(err);
    }
    else {
      Object.keys(api.paths).forEach((path) => {
        for (var methodName in api.paths[`${path}`]) {
          let lambdaFunctionFile = api.paths[`${path}`][`${methodName}`][`operationId`]
          Generator.generate(
            {
              outputFile: `../../../../lambda-fns/${lambdaFunctionFile}.ts`,
            },
            (writer: TextWriter) => {
              const lambda = new LambdaFunction(writer);
              lambda.helloWorldFunction(lambdaFunctionFile);
            }
          );
        }
      })
    }
  })
}