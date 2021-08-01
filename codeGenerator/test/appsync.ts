import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Appsync } from "../../functions/Appsync";
import { Iam } from "../../functions/iam";
import { TestingConstructs } from "../../functions/constructsTest/index";
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY, API_NAME, LAMBDA_STYLE } = jsonObj;

const API_TYPE = "GRAPHQL";

if (API_TYPE === "GRAPHQL") {
  Generator.generateFromModel(
    {
      outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-appsync.test.ts`,
    },
    (output: TextWriter, model: any) => {
      const ts = new TypeScriptWriter(output);
      const iam = new Iam(output);
      const appsync = new Appsync(output);
      const testClass = new TestingConstructs(output);
      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      testClass.ImportsForTest(output);
      testClass.initializeTest("Appsync Api Constructs Test",() => {
          appsync.apiName = API_NAME;
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

          if (LAMBDA_STYLE === "single lambda") {
            let dsName = `${API_NAME}_dataSource`
            appsync.appsyncDatasourceTest(dsName, 0);
          }
          else if (LAMBDA_STYLE === "multiple lambda" && mutationsAndQueries) {
            Object.keys(mutationsAndQueries).forEach((key,index)=>{
              if (LAMBDA_STYLE === "multiple lambda") {
                let dsName = `${API_NAME}_dataSource_${key}`
                appsync.appsyncDatasourceTest(dsName,index);
                ts.writeLine();
              }
            });
          }
          ts.writeLine();

          if (model?.type?.Query) {
            for (var key in model?.type?.Query) {
              if (LAMBDA_STYLE === "single lambda") {
                appsync.appsyncResolverTest(key,"Query",`${API_NAME}_dataSource`);
              }
              if (LAMBDA_STYLE === "multiple lambda") {
                appsync.appsyncResolverTest(key,"Query",`${API_NAME}_dataSource_${key}`);
                ts.writeLine();
              }
            }
          }
          ts.writeLine();

          if (model?.type?.Mutation) {
            for (var key in model?.type?.Mutation) {
              if (LAMBDA_STYLE === "single lambda") {
                appsync.appsyncResolverTest(key,"Mutation",`${API_NAME}_dataSource`);
                ts.writeLine();
              }
              if (LAMBDA_STYLE === "multiple lambda") {
                appsync.appsyncResolverTest(key,"Mutation",`${API_NAME}_dataSource_${key}`);
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
