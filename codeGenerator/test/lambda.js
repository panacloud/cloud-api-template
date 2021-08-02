"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const iam_1 = require("../../functions/iam");
const index_1 = require("../../functions/constructsTest/index");
const lambda_1 = require("../../functions/lambda");
const model = require(`../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
if ((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.lambdaStyle) {
    templating_1.Generator.generateFromModel({ outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-lambda.test.ts`, }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new index_1.TestingConstructs(output);
        const iam = new iam_1.Iam(output);
        const lambda = new lambda_1.Lambda(output);
        const { apiName, lambdaStyle, database } = model.api;
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        testClass.ImportsForTest(output);
        ts.writeLine();
        testClass.initializeTest("Lambda Attach With Dynamodb Constructs Test", () => {
            ts.writeLine();
            iam.DynodbIdentifierFromStack();
            ts.writeLine();
            if (lambdaStyle === "single") {
                let funcName = `${apiName}Lambda`;
                lambda.initializeTestForLambdaWithDynodb(funcName, "main");
            }
            else if (lambdaStyle === "multiple") {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    let funcName = `${apiName}Lambda${key}`;
                    lambda.initializeTestForLambdaWithDynodb(funcName, key);
                    ts.writeLine();
                });
            }
            ts.writeLine();
            iam.lambdaServiceRoleTest();
            ts.writeLine();
            if (lambdaStyle === "single") {
                iam.lambdaServiceRolePolicyTestForDynodb(1);
            }
            else if (lambdaStyle === "multiple") {
                iam.lambdaServiceRolePolicyTestForDynodb(Object.keys(mutationsAndQueries).length);
            }
            ts.writeLine();
        }, output);
    });
}
