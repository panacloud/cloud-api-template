import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { DATABASE, LAMBDA } from "../../../../cloud-api-constants";
import { DynamoDB } from "../../../../Constructs/DynamoDB";
const model = require("../../../../model.json");
const { apiName, lambdaStyle, database } = model.api;

const mutations = model.type.Mutation ? model.type.Mutation : {};
const queries = model.type.Query ? model.type.Query : {};

const mutationsAndQueries = {
  ...mutations,
  ...queries,
};



export const dynamodbAccessHandler = (output:TextWriter)=>{
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

export const dynamodbPropsHandler = () => {
  if (lambdaStyle && lambdaStyle === LAMBDA.single) {
    return [
      {
        name: `${apiName}_lambdaFn`,
        type: "lambda.Function",
      },
    ];
  }

  if (lambdaStyle && lambdaStyle === LAMBDA.multiple) {
    let dbProps = [
      {
        name: `${apiName}_lambdaFn`,
        type: "lambda.Function",
      },
    ];
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      dbProps[index] = {
        name: `${apiName}_lambdaFn_${key}`,
        type: "lambda.Function",
      };
    });
    return dbProps;
  }
};
