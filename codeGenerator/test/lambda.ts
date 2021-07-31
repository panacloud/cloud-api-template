import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Iam } from "../../functions/iam";
import { TestingConstructs } from "../../functions/constructsTest/index";
import { Lambda } from "../../functions/lambda";
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY , API_NAME , LAMBDA_STYLE} = jsonObj;

if(LAMBDA_STYLE === "single lambda") {
    Generator.generate({outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-lambda.test.ts`,},
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const testClass = new TestingConstructs(output)
      const iam = new Iam(output)
      const lambda = new Lambda(output)
      testClass.ImportsForTest(output)
      ts.writeLine()
      testClass.initializeTest("Lambda Attach With Dynamodb Constructs Test",()=>{
        ts.writeLine()
        iam.DynodbIdentifierFromStack()
        ts.writeLine()
        lambda.initializeTestForLambdaWithDynodb(API_NAME)
        ts.writeLine()
        iam.lambdaServiceRoleTest()
        ts.writeLine()
        iam.lambdaIdentifierFromStack()
        ts.writeLine()
        iam.roleIdentifierFromLambda()
        ts.writeLine()
        iam.lambdaServiceRolePolicyTestForDynodb()
        ts.writeLine()
      },output)
    }
  )}
