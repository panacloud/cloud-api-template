import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import {
  LAMBDASTYLE,
  CONSTRUCTS,
  APITYPE,
  PATH,
} from "../../../utils/constant";
import { Appsync } from "../../../lib/Appsync";
import { Cdk } from "../../../lib/Cdk";
import { Imports } from "../../../lib/ConstructsImports";
import { Iam } from "../../../lib/Iam";
import { appsyncDatasourceHandler, appsyncResolverhandler } from "./functions";
const model = require("../../../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { apiType } = model.api;
const fs = require("fs");

if (apiType === APITYPE.graphql) {
  Generator.generate(
    {
      outputFile: `${PATH.construct}${CONSTRUCTS.appsync}/index.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const appsync = new Appsync(output);
      const cdk = new Cdk(output);
      const iam = new Iam(output);
      const imp = new Imports(output);
      const schema = fs
        .readFileSync(`../../../../../schema.graphql`)
        .toString("utf8");
      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      const { apiName, lambdaStyle, database } = model.api;

      imp.importsForStack(output);
      imp.importAppsync(output);
      imp.importIam(output);

      let ConstructProps = [
        {
          name: `${apiName}_lambdaFnArn`,
          type: "string",
        },
      ];

      if (lambdaStyle && lambdaStyle === LAMBDASTYLE.multi) {
        Object.keys(mutationsAndQueries).forEach(
          (key: string, index: number) => {
            ConstructProps[index] = {
              name: `${apiName}_lambdaFn_${key}Arn`,
              type: "string",
            };
          }
        );
      }

      cdk.initializeConstruct(
        `${CONSTRUCTS.appsync}`,
        "AppsyncProps",
        () => {
          ts.writeLine();
          appsync.initializeAppsyncApi(apiName, output);
          ts.writeLine();
          appsync.initializeAppsyncSchema(schema, output);
          ts.writeLine();
          appsync.initializeApiKeyForAppsync(apiName);
          ts.writeLine();
          iam.serviceRoleForAppsync(output, apiName);
          ts.writeLine();
          iam.attachLambdaPolicyToRole(`${apiName}`);
          ts.writeLine();
          appsyncDatasourceHandler(
            apiName,
            output,
            lambdaStyle,
            mutationsAndQueries
          );
          ts.writeLine();
          appsyncResolverhandler(apiName, output, lambdaStyle);
        },
        output,
        ConstructProps
      );
    }
  );
}
