"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Iam_1 = require("../../../Constructs/Iam");
const Cdk_1 = require("../../../Constructs/Cdk");
const Lambda_1 = require("../../../Constructs/Lambda");
<<<<<<< HEAD
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
=======
const constant_1 = require("../../../constant");
>>>>>>> dev
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
if ((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.lambdaStyle) {
    templating_1.Generator.generate({
<<<<<<< HEAD
        outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-lambda.test.ts`,
=======
        outputFile: `${constant_1.PATH.test}${USER_WORKING_DIRECTORY}-lambda.test.ts`,
>>>>>>> dev
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const cdk = new Cdk_1.Cdk(output);
        const iam = new Iam_1.Iam(output);
        const lambda = new Lambda_1.Lambda(output);
<<<<<<< HEAD
        const imp = new ConstructsImports_1.Imports(output);
        const { apiName, lambdaStyle, database } = model.api;
=======
        const cdk = new Cdk_1.Cdk(output);
        const { apiName, lambdaStyle } = model.api;
>>>>>>> dev
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        imp.ImportsForTest(output, USER_WORKING_DIRECTORY);
        if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
            imp.importForDynamodbConstructInTest(output);
            ts.writeLine();
        }
        cdk.initializeTest("Lambda Attach With Dynamodb Constructs Test", () => {
            ts.writeLine();
<<<<<<< HEAD
            if (lambdaStyle === cloud_api_constants_1.LAMBDA.single && database === cloud_api_constants_1.DATABASE.dynamoDb) {
=======
            if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
>>>>>>> dev
                let funcName = `${apiName}Lambda`;
                iam.dynamodbConsturctIdentifier();
                ts.writeLine();
                iam.DynodbTableIdentifier();
                ts.writeLine();
                lambda.initializeTestForLambdaWithDynamoDB(funcName, "main");
                ts.writeLine();
            }
<<<<<<< HEAD
            else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple && database === cloud_api_constants_1.DATABASE.dynamoDb) {
=======
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
>>>>>>> dev
                Object.keys(mutationsAndQueries).forEach((key) => {
                    let funcName = `${apiName}Lambda${key}`;
                    lambda.initializeTestForLambdaWithDynamoDB(funcName, key);
                    ts.writeLine();
                });
            }
            iam.lambdaServiceRoleTest();
            ts.writeLine();
<<<<<<< HEAD
            if (lambdaStyle === cloud_api_constants_1.LAMBDA.single && database === cloud_api_constants_1.DATABASE.dynamoDb) {
                iam.lambdaServiceRolePolicyTestForDynodb(1);
            }
            else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple && database === cloud_api_constants_1.DATABASE.dynamoDb) {
=======
            if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                iam.lambdaServiceRolePolicyTestForDynodb(1);
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
>>>>>>> dev
                iam.lambdaServiceRolePolicyTestForDynodb(Object.keys(mutationsAndQueries).length);
            }
            ts.writeLine();
        }, output, USER_WORKING_DIRECTORY);
    });
}
