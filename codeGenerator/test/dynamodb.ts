import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { TestingConstructs } from "../../functions/constructsTest";
import { DynamoDB } from "../../functions/dynamoDB";
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY , API_NAME } = jsonObj;

const DATABASE = "DYNAMODB"
if(DATABASE==="DYNAMODB"){
    Generator.generate({outputFile:`../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-dynamodb.test.ts`,},
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const testClass = new TestingConstructs(output)
      const dynodb = new DynamoDB(output)
      testClass.ImportsForTest(output)
      ts.writeLine()
      testClass.initializeTest("Dynamodb Constructs Test",()=>{
        ts.writeLine()
        dynodb.initializeTestForDynamodb(API_NAME)
      },output)
    })
  }

