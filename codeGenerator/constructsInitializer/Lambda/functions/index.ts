import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { DATABASE, LAMBDA } from "../../../../cloud-api-constants";
import { Lambda } from "../../../../Constructs/Lambda";
const model = require("../../../../model.json");
const { apiName, lambdaStyle, database } = model.api;

const mutations = model.type.Mutation ? model.type.Mutation : {};
const queries = model.type.Query ? model.type.Query : {};

const mutationsAndQueries = {
  ...mutations,
  ...queries,
};

export const lambdaHandlerForDynamodb = (output: TextWriter) => {
  const lambda = new Lambda(output);
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle === LAMBDA.single) {
    if (database === DATABASE.dynamoDb) {
      lambda.initializeLambda(
        apiName,
        output,
        lambdaStyle,
        undefined,
        undefined,
        undefined
      );
      ts.writeLine();
      ts.writeLine(`this.mainHandler = ${apiName}_lambdaFn`);
    }
  }

  else if (lambdaStyle === LAMBDA.single) {
    if (database === DATABASE.dynamoDb) {
      Object.keys(mutationsAndQueries).forEach((key) => {
        lambda.initializeLambda(
          apiName,
          output,
          lambdaStyle,
          key,
          undefined,
          undefined
        );
        ts.writeLine();
        ts.writeLine(`this.${key}Handler = ${apiName}_lambdaFn_${key}`);
        ts.writeLine();
      });
    }
  }else{
      ts.writeLine("lambda not found")
  }
};
