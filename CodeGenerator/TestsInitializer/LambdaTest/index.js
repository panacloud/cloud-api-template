"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Iam_1 = require("../../../Constructs/Iam");
const Cdk_1 = require("../../../Constructs/Cdk");
const Lambda_1 = require("../../../Constructs/Lambda");
const constant_1 = require("../../../constant");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
if ((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.lambdaStyle) {
    templating_1.Generator.generateFromModel({
        outputFile: `${constant_1.PATH.test}${USER_WORKING_DIRECTORY}-lambda.test.ts`,
    }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new Cdk_1.Cdk(output);
        const iam = new Iam_1.Iam(output);
        const lambda = new Lambda_1.Lambda(output);
        const cdk = new Cdk_1.Cdk(output);
        const { apiName, lambdaStyle } = model.api;
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        testClass.ImportsForTest(output, USER_WORKING_DIRECTORY);
        cdk.importForDynamodbConstruct(output);
        ts.writeLine();
        testClass.initializeTest("Lambda Attach With Dynamodb Constructs Test", () => {
            ts.writeLine();
            iam.dynamodbConsturctIdentifier();
            ts.writeLine();
            iam.DynodbTableIdentifier();
            ts.writeLine();
            if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                let funcName = `${apiName}Lambda`;
                lambda.initializeTestForLambdaWithDynamoDB(funcName, "main");
                ts.writeLine();
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    let funcName = `${apiName}Lambda${key}`;
                    lambda.initializeTestForLambdaWithDynamoDB(funcName, key);
                    ts.writeLine();
                });
            }
            iam.lambdaServiceRoleTest();
            ts.writeLine();
            if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                iam.lambdaServiceRolePolicyTestForDynodb(1);
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                iam.lambdaServiceRolePolicyTestForDynodb(Object.keys(mutationsAndQueries).length);
            }
            ts.writeLine();
        }, output, USER_WORKING_DIRECTORY);
    });
}
