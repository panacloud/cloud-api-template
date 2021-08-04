import { LAMBDA } from "../../../../cloud-api-constants";
import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Appsync } from "../../../../Constructs/Appsync";
const model = require("../../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { apiName, lambdaStyle, database } = model.api;
const mutations = model.type.Mutation ? model.type.Mutation : {};
const queries = model.type.Query ? model.type.Query : {};

const mutationsAndQueries = {
  ...mutations,
  ...queries,
};

export const appsyncDatasourceHandler = (output: TextWriter) => {
  const appsync = new Appsync(output);
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle === LAMBDA.single) {
    appsync.appsyncLambdaDataSource(
      output,
      apiName,
      apiName,
      lambdaStyle
    );
  } else if (lambdaStyle === LAMBDA.multiple) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      appsync.appsyncLambdaDataSource(
        output,
        apiName,
        apiName,
        lambdaStyle,
        key
      );
      ts.writeLine();
    });
  } else {
    ts.writeLine();
  }
};


export const appsyncResolverhandler = (output: TextWriter) => {
    const appsync = new Appsync(output);
    const ts = new TypeScriptWriter(output);
    if (model?.type?.Query) {
        for (var key in model?.type?.Query) {
          if (lambdaStyle === LAMBDA.single) {
            appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}`,output);
          } else if (lambdaStyle === LAMBDA.multiple) {
            appsync.appsyncLambdaResolver(key,"Query",`ds_${apiName}_${key}`,output);
          }
        }
        ts.writeLine();
      }

      if (model?.type?.Mutation) {
        for (var key in model?.type?.Mutation) {
          if (lambdaStyle === LAMBDA.single) {
            appsync.appsyncLambdaResolver(key,"Mutation",`ds_${apiName}`,output);
          } else if (lambdaStyle === LAMBDA.multiple) {
            appsync.appsyncLambdaResolver(key,"Mutation",`ds_${apiName}_${key}`,output);
          }
        }
        ts.writeLine();
      }
  };