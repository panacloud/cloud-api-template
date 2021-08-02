"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const constructsTest_1 = require("../../functions/constructsTest");
const dynamoDB_1 = require("../../functions/dynamoDB");
const model = require(`../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
if (((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.database) === "DynamoDB") {
    templating_1.Generator.generate({ outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-dynamodb.test.ts`, }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new constructsTest_1.TestingConstructs(output);
        const dynodb = new dynamoDB_1.DynamoDB(output);
        testClass.ImportsForTest(output);
        ts.writeLine();
        testClass.initializeTest("Dynamodb Constructs Test", () => {
            var _a;
            ts.writeLine();
            dynodb.initializeTestForDynamodb((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.apiName);
        }, output);
    });
}
