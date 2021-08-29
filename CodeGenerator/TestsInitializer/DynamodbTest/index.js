"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Cdk_1 = require("../../../Constructs/Cdk");
const DynamoDB_1 = require("../../../Constructs/DynamoDB");
const constant_1 = require("../../../constant");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
if (((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.database) === constant_1.DATABASE.dynamo) {
    templating_1.Generator.generate({
        outputFile: `${constant_1.PATH.test}${USER_WORKING_DIRECTORY}-dynamodb.test.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new Cdk_1.Cdk(output);
        const dynodb = new DynamoDB_1.DynamoDB(output);
        const imp = new ConstructsImports_1.Imports(output);
        imp.ImportsForTest(output, USER_WORKING_DIRECTORY, 'pattern1');
        ts.writeLine();
        testClass.initializeTest("Dynamodb Constructs Test", () => {
            var _a;
            ts.writeLine();
            dynodb.initializeTestForDynamodb((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.apiName);
        }, output, USER_WORKING_DIRECTORY, "pattern_v1");
    });
}
