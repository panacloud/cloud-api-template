"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Appsync_1 = require("../../functions/Appsync");
const iam_1 = require("../../functions/iam");
const index_1 = require("../../functions/constructsTest/index");
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY, API_NAME } = jsonObj;
const API_TYPE = "GRAPHQL";
if (API_TYPE === "GRAPHQL") {
    templating_1.Generator.generate({ outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-appsync.test.ts` }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const iam = new iam_1.Iam(output);
        const appsync = new Appsync_1.Appsync(output);
        const testClass = new index_1.TestingConstructs(output);
        testClass.ImportsForTest(output);
        testClass.initializeTest("Appsync Api Constructs", () => {
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
            appsync.appsyncDatasourceTest();
            ts.writeLine();
            appsync.appsyncResolverTest();
        }, output);
    });
}
