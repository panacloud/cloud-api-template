import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Appsync } from "../../../lib/Appsync";
import { Iam } from "../../../lib/Iam";
import { Cdk } from "../../../lib/Cdk";
import { PATH, LAMBDASTYLE, APITYPE } from "../../../utils/constant";
import { Imports } from "../../../lib/ConstructsImports";
const model = require(`../../../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const { apiType } = model.api;

if (apiType === APITYPE.graphql) {
  Generator.generate(
    {
      outputFile: `${PATH.test}${USER_WORKING_DIRECTORY}-appsync.test.ts`,
    },
    (output: TextWriter) => {
      const { apiName, lambdaStyle, database } = model.api;
      const ts = new TypeScriptWriter(output);
      const iam = new Iam(output);
      const appsync = new Appsync(output);
      const imp = new Imports(output);
      const testClass = new Cdk(output);

      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      imp.ImportsForTest(output, USER_WORKING_DIRECTORY, "pattern1");
      imp.importForAppsyncConstructInTest(output);
      imp.importForLambdaConstructInTest(output);
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

          if (lambdaStyle === LAMBDASTYLE.single) {
            let dsName = `${apiName}_dataSource`;
            appsync.appsyncDatasourceTest(dsName, 0);
          } else if (lambdaStyle === LAMBDASTYLE.multi && mutationsAndQueries) {
            Object.keys(mutationsAndQueries).forEach((key, index) => {
              if (lambdaStyle === LAMBDASTYLE.multi) {
                let dsName = `${apiName}_dataSource_${key}`;
                appsync.appsyncDatasourceTest(dsName, index);
                ts.writeLine();
              }
            });
          }
          ts.writeLine();

          if (model?.type?.Query) {
            for (var key in model?.type?.Query) {
              if (lambdaStyle === LAMBDASTYLE.single) {
                appsync.appsyncResolverTest(
                  key,
                  "Query",
                  `${apiName}_dataSource`
                );
              }
              if (lambdaStyle === LAMBDASTYLE.multi) {
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
              if (lambdaStyle === LAMBDASTYLE.single) {
                appsync.appsyncResolverTest(
                  key,
                  "Mutation",
                  `${apiName}_dataSource`
                );
                ts.writeLine();
              }
              if (lambdaStyle === LAMBDASTYLE.multi) {
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
        USER_WORKING_DIRECTORY,
        "pattern_v1"
      );
    }
  );
}
