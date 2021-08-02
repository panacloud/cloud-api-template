import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Iam } from "../../functions/iam";
import { TestingConstructs } from "../../functions/constructsTest/index";
import { Lambda } from "../../functions/lambda";
const model = require(`../../model.json`);
const { USER_WORKING_DIRECTORY} = model;

if(model?.api?.lambdaStyle) {
    Generator.generateFromModel({outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-lambda.test.ts`,},
    (output: TextWriter,model:any) => {
      const ts = new TypeScriptWriter(output);
      const testClass = new TestingConstructs(output)
      const iam = new Iam(output)
      const lambda = new Lambda(output)
      const { apiName, lambdaStyle, database } = model.api;
      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      testClass.ImportsForTest(output)
      ts.writeLine()
      testClass.initializeTest("Lambda Attach With Dynamodb Constructs Test",()=>{
        ts.writeLine()
        iam.DynodbIdentifierFromStack()
        ts.writeLine()
        if (lambdaStyle === "single") {
          let funcName = `${apiName}Lambda`
          lambda.initializeTestForLambdaWithDynodb(funcName,"main")
        }
        else if(lambdaStyle === "multiple") {
          Object.keys(mutationsAndQueries).forEach((key) => {
            let funcName = `${apiName}Lambda${key}`
            lambda.initializeTestForLambdaWithDynodb(funcName,key);
            ts.writeLine();
          })
        }
        ts.writeLine()
        iam.lambdaServiceRoleTest()
        ts.writeLine()

        if(lambdaStyle === "single"){
          iam.lambdaServiceRolePolicyTestForDynodb(1)
        }
        else if(lambdaStyle === "multiple"){
          iam.lambdaServiceRolePolicyTestForDynodb(Object.keys(mutationsAndQueries).length)
        }
        ts.writeLine()
        
      },output)
    }
  )}
