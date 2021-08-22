import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LAMBDASTYLE } from "../../../../constant";
import { Appsync } from "../../../../Constructs/Appsync";
import { Cdk } from "../../../../Constructs/Cdk";
const model = require("../../../../model.json");
const { lambdaStyle } = model.api;

export const appsyncDatasourceHandler = (
  apiName: string,
  output: TextWriter
) => {
  const appsync = new Appsync(output);
  appsync.apiName = apiName;
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle === LAMBDASTYLE.single) {
    appsync.appsyncLambdaDataSource(output, apiName, apiName, lambdaStyle);
  } else if (lambdaStyle === LAMBDASTYLE.multi) {
    const mutations = model.type.Mutation ? model.type.Mutation : {};
    const queries = model.type.Query ? model.type.Query : {};

    const mutationsAndQueries = {
      ...mutations,
      ...queries,
    };
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

export const appsyncResolverhandler = (apiName: string, output: TextWriter) => {
  const appsync = new Appsync(output);
  appsync.apiName = apiName;
  const cdk = new Cdk(output);
  const ts = new TypeScriptWriter(output);
  if (model?.type?.Query) {
    for (var key in model?.type?.Query) {
      if (lambdaStyle === LAMBDASTYLE.single) {
        appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}`, output);
        ts.writeLine();
        cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
        cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}`);
        ts.writeLine();
      } else if (lambdaStyle === LAMBDASTYLE.multi) {
        appsync.appsyncLambdaResolver(
          key,
          "Query",
          `ds_${apiName}_${key}`,
          output
        );
        ts.writeLine();
        cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
        cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}_${key}`);
        ts.writeLine();
      }
    }
    ts.writeLine();
  }

  if (model?.type?.Mutation) {
    for (var key in model?.type?.Mutation) {
      if (lambdaStyle === LAMBDASTYLE.single) {
        appsync.appsyncLambdaResolver(key, "Mutation", `ds_${apiName}`, output);
        ts.writeLine();
        cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
        cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}`);
        ts.writeLine();
      } else if (lambdaStyle === LAMBDASTYLE.multi) {
        appsync.appsyncLambdaResolver(
          key,
          "Mutation",
          `ds_${apiName}_${key}`,
          output
        );
        ts.writeLine();
        cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
        cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}_${key}`);
        ts.writeLine();
      }
    }
    ts.writeLine();
  }
};
