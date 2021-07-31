"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const iam_1 = require("../../functions/iam");
const index_1 = require("../../functions/constructsTest/index");
const lambda_1 = require("../../functions/lambda");
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY, API_NAME, LAMBDA_STYLE } = jsonObj;
if (LAMBDA_STYLE === "single lambda") {
    templating_1.Generator.generate({ outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-lambda.test.ts`, }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new index_1.TestingConstructs(output);
        const iam = new iam_1.Iam(output);
        const lambda = new lambda_1.Lambda(output);
        testClass.ImportsForTest(output);
        ts.writeLine();
        testClass.initializeTest("Lambda Attach With Dynamodb Constructs Test", () => {
            ts.writeLine();
            iam.DynodbIdentifierFromStack();
            ts.writeLine();
            lambda.initializeTestForLambdaWithDynodb(API_NAME);
            ts.writeLine();
            iam.lambdaServiceRoleTest();
            ts.writeLine();
            iam.lambdaIdentifierFromStack();
            ts.writeLine();
            iam.roleIdentifierFromLambda();
            ts.writeLine();
            iam.lambdaServiceRolePolicyTestForDynodb();
            ts.writeLine();
        }, output);
    });
}
