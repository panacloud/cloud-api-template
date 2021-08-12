import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { LambdaFunction } from "../../Constructs/Lambda/lambdaFunction";
import { APITYPE, LAMBDA } from "../../cloud-api-constants";
const SwaggerParser = require('@apidevtools/swagger-parser');
const jsonObj = require(`../../model.json`);
const openApi = require("../../schema.json")
const { lambdaStyle, apiType } = jsonObj.api;

if (lambdaStyle === LAMBDA.single) {
  if(apiType === APITYPE.graphql) {
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
  else {
    SwaggerParser.validate(openApi, (err: any, api: any) => {
      if (err) {
        console.error(err);
      }
      else {
        Object.keys(api.paths).forEach((path, i) => {
          console.log("PathName => ", path);
          Object.keys(api.paths[path]).forEach((methodName) => {
            console.log("Lambda file name => ", api.paths.path.methodName.operationId);
            api.paths.path.methodName.parameters.forEach((param: any) => {
              console.log("InputParam => ", param.name);
            })
          })
        })
      }
    })
  }
}