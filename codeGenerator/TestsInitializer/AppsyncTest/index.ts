import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Appsync } from "../../../Constructs/Appsync";
import { Iam } from "../../../Constructs/iam";
import { Cdk } from "../../../Constructs/Cdk";
import { LAMBDA } from "../../../cloud-api-constants";
const jsonObj = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = jsonObj;

const API_TYPE = "GRAPHQL";

if (API_TYPE === "GRAPHQL") {
  Generator.generateFromModel(
    {
      outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-appsync.test.ts`,
    },
    (output: TextWriter, model: any) => {
      const { apiName, lambdaStyle, database } = model.api;
      const ts = new TypeScriptWriter(output);
      const iam = new Iam(output);
      const appsync = new Appsync(output);
      const cdk = new Cdk(output)
      const testClass = new Cdk(output);
      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      testClass.ImportsForTest(output, USER_WORKING_DIRECTORY);
      cdk.importForAppsyncConstruct(output)
      cdk.importForLambdaConstruct(output)
      testClass.initializeTest(
        "Appsync Api Constructs Test",
        () => {
          appsync.apiName = apiName;
          iam.appsyncConsturctIdentifier();
          ts.writeLine();
          iam.appsyncApiIdentifier();
          ts.writeLine();
          appsync.appsyncApiTest();
          ts.writeLine();
          appsync.appsyncApiKeyTest();
          ts.writeLine();
          iam.appsyncRoleIdentifier();
          ts.writeLine();
          iam.appsyncServiceRoleTest();
          ts.writeLine();
          iam.appsyncRolePolicyTest();
          ts.writeLine();
          iam.lambdaConsturctIdentifier();
          ts.writeLine();
          iam.lambdaIdentifier();
          ts.writeLine();

          if (lambdaStyle === LAMBDA.single) {
            let dsName = `${apiName}_dataSource`;
            appsync.appsyncDatasourceTest(dsName, 0);
          } else if (lambdaStyle === LAMBDA.multiple && mutationsAndQueries) {
            Object.keys(mutationsAndQueries).forEach((key, index) => {
              if (lambdaStyle === LAMBDA.multiple) {
                let dsName = `${apiName}_dataSource_${key}`;
                appsync.appsyncDatasourceTest(dsName, index);
                ts.writeLine();
              }
            });
          }
          ts.writeLine();

          if (model?.type?.Query) {
            for (var key in model?.type?.Query) {
              if (lambdaStyle === LAMBDA.single) {
                appsync.appsyncResolverTest(
                  key,
                  "Query",
                  `${apiName}_dataSource`
                );
              }
              if (lambdaStyle === LAMBDA.multiple) {
                appsync.appsyncResolverTest(
                  key,
                  "Query",
                  `${apiName}_dataSource_${key}`
                );
                ts.writeLine();
              }
            }
          }
          ts.writeLine();

          if (model?.type?.Mutation) {
            for (var key in model?.type?.Mutation) {
              if (lambdaStyle === LAMBDA.single) {
                appsync.appsyncResolverTest(
                  key,
                  "Mutation",
                  `${apiName}_dataSource`
                );
                ts.writeLine();
              }
              if (lambdaStyle === LAMBDA.multiple) {
                appsync.appsyncResolverTest(
                  key,
                  "Mutation",
                  `${apiName}_dataSource_${key}`
                );
                ts.writeLine();
              }
            }
          }
        },
        output,
        USER_WORKING_DIRECTORY
      );
    }
  );
}
