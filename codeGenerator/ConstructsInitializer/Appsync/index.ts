import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { DATABASE, LAMBDA, CONSTRUCTS } from "../../../cloud-api-constants";
import { Appsync } from "../../../Constructs/Appsync";
import { Cdk } from "../../../Constructs/Cdk";
import { Iam } from "../../../Constructs/Iam";
import { appsyncDatasourceHandler, appsyncResolverhandler } from "./functions";
const model = require("../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const fs = require("fs");

Generator.generateFromModel(
  {
    outputFile: `../../../../../lib/${CONSTRUCTS.appsync}/index.ts`,
  },
  (output: TextWriter, model: any) => {
    const ts = new TypeScriptWriter(output);
    const appsync = new Appsync(output);
    const cdk = new Cdk(output);
    const iam = new Iam(output);
    const schema = fs.readFileSync(`../../../schema.graphql`).toString("utf8");
    const mutations = model.type.Mutation ? model.type.Mutation : {};
    const queries = model.type.Query ? model.type.Query : {};
    const mutationsAndQueries = { ...mutations, ...queries };
    const { apiName, lambdaStyle, database } = model.api;
    cdk.importsForStack(output);
    appsync.importAppsync(output);
    iam.importIam(output);

    let ConstructProps = [
      {
        name: `${apiName}_lambdaFnArn`,
        type: "string",
      },
    ];

    if (lambdaStyle && lambdaStyle === LAMBDA.multiple) {
      Object.keys(mutationsAndQueries).forEach((key: string, index: number) => {
        ConstructProps[index] = {
          name: `${apiName}_lambdaFn_${key}Arn`,
          type: "string",
        };
      });
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
        appsyncDatasourceHandler(apiName, output);
        ts.writeLine();
        appsyncResolverhandler(apiName, output);
      },
      output,
      ConstructProps
    );
  }
);
