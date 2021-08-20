import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { APITYPE, DATABASE, LAMBDA } from "../../../../cloud-api-constants";
import { DynamoDB } from "../../../../Constructs/DynamoDB";
const model = require("../../../../model.json");
const { lambdaStyle, apiType } = model.api;

let mutations = {};
let queries = {}
if (apiType === APITYPE.graphql) {
  mutations = model.type.Mutation ? model.type.Mutation : {};
  queries = model.type.Query ? model.type.Query : {};
}
const mutationsAndQueries = { ...mutations, ...queries };

export const dynamodbAccessHandler = (apiName:string,output:TextWriter)=>{
  const dynamoDB = new DynamoDB(output)
  const ts = new TypeScriptWriter(output)
  if (lambdaStyle === LAMBDA.single) {
    dynamoDB.grantFullAccess(
      `${apiName}`,
      `${apiName}_table`,
      lambdaStyle
    );
  } else if (lambdaStyle === LAMBDA.multiple) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      dynamoDB.grantFullAccess(
        `${apiName}`,
        `${apiName}_table`,
        lambdaStyle,
        key
      );
      ts.writeLine();
    });
  }
}

export const dynamodbPropsHandler = (apiName:string,output:TextWriter) => {
  const ts = new TypeScriptWriter(output)
  if (lambdaStyle && lambdaStyle === LAMBDA.single) {
    const props = {
      name: `${apiName}_lambdaFn`,
      type: "lambda.Function",
    }
  }

  if (lambdaStyle && lambdaStyle === LAMBDA.multiple) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      const props = {
        name: `${apiName}_lambdaFn_${key}`,
        type: "lambda.Function",
      };
      ts.writeLine(`${props}`)
    });
  }
};
