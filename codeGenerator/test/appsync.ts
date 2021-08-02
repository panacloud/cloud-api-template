import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Appsync } from "../../functions/Appsync";
import { Iam } from "../../functions/iam";
import { TestingConstructs } from "../../functions/constructsTest/index";
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY } = jsonObj;

const API_TYPE = "GRAPHQL";

if (API_TYPE === "GRAPHQL") {
  Generator.generateFromModel(
    {
      outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-appsync.test.ts`,
    },
    (output: TextWriter, model: any) => {
      const { apiName, lambdaStyle, database } = model.api;
      const ts = new TypeScriptWriter(output);
      const iam = new Iam(output);
      const appsync = new Appsync(output);
      const testClass = new TestingConstructs(output);
      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      testClass.ImportsForTest(output);
      testClass.initializeTest("Appsync Api Constructs Test",() => {
          appsync.apiName = apiName;
          appsync.appsyncApiTest();
          ts.writeLine();
          appsync.appsyncApiKeyTest();
          ts.writeLine();
          iam.appsyncServiceRoleTest();
          ts.writeLine();
          iam.roleIdentifierFromStack();
          ts.writeLine();
          iam.appsyncRolePolicyTest();
          ts.writeLine();
          iam.lambdaIdentifierFromStack();
          ts.writeLine();

          if (lambdaStyle === "single") {
            let dsName = `${apiName}_dataSource`
            appsync.appsyncDatasourceTest(dsName, 0);
          }
          else if (lambdaStyle === "multiple" && mutationsAndQueries) {
            Object.keys(mutationsAndQueries).forEach((key,index)=>{
              if (lambdaStyle === "multiple") {
                let dsName = `${apiName}_dataSource_${key}`
                appsync.appsyncDatasourceTest(dsName,index);
                ts.writeLine();
              }
            });
          }
          ts.writeLine();

          if (model?.type?.Query) {
            for (var key in model?.type?.Query) {
              if (lambdaStyle === "single") {
                appsync.appsyncResolverTest(key,"Query",`${apiName}_dataSource`);
              }
              if (lambdaStyle === "multiple") {
                appsync.appsyncResolverTest(key,"Query",`${apiName}_dataSource_${key}`);
                ts.writeLine();
              }
            }
          }
          ts.writeLine();

          if (model?.type?.Mutation) {
            for (var key in model?.type?.Mutation) {
              if (lambdaStyle === "single") {
                appsync.appsyncResolverTest(key,"Mutation",`${apiName}_dataSource`);
                ts.writeLine();
              }
              if (lambdaStyle === "multiple") {
                appsync.appsyncResolverTest(key,"Mutation",`${apiName}_dataSource_${key}`);
                ts.writeLine();
              }
            }
          }
        },
        output
      );
    }
  );
}
