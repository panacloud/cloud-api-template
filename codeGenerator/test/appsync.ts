import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Appsync } from "../../functions/Appsync";
import { Iam } from "../../functions/iam";
import { TestingConstructs } from "../../functions/constructsTest/index";
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY , API_NAME } = jsonObj;

const API_TYPE ="GRAPHQL"

if(API_TYPE === "GRAPHQL"){
  Generator.generate({outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-appsync.test.ts`},
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const iam = new Iam(output)
      const appsync = new Appsync(output);
      const testClass = new TestingConstructs(output)
      testClass.ImportsForTest(output)
      testClass.initializeTest("Appsync Api Constructs",()=>{
          appsync.apiName = API_NAME 
          appsync.appsyncApiTest()
          ts.writeLine()
          appsync.appsyncApiKeyTest()
          ts.writeLine()
          iam.appsyncServiceRoleTest()
          ts.writeLine()
          iam.roleIdentifierFromStack()
          ts.writeLine()
          iam.appsyncRolePolicyTest()
          ts.writeLine()
          iam.lambdaIdentifierFromStack()
          ts.writeLine()
          appsync.appsyncDatasourceTest()
          ts.writeLine()
          appsync.appsyncResolverTest()
      },output)
    }   
  );
}
