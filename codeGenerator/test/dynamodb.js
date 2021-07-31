"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const constructsTest_1 = require("../../functions/constructsTest");
const dynamoDB_1 = require("../../functions/dynamoDB");
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY, API_NAME } = jsonObj;
const DATABASE = "DYNAMODB";
if (DATABASE === "DYNAMODB") {
    templating_1.Generator.generate({ outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-dynamodb.test.ts`, }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new constructsTest_1.TestingConstructs(output);
        const dynodb = new dynamoDB_1.DynamoDB(output);
        testClass.ImportsForTest(output);
        ts.writeLine();
        testClass.initializeTest("Dynamodb Constructs Test", () => {
            ts.writeLine();
            dynodb.initializeTestForDynamodb(API_NAME);
        }, output);
    });
}
