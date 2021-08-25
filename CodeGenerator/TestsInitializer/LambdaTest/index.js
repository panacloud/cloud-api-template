"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Iam_1 = require("../../../Constructs/Iam");
const Cdk_1 = require("../../../Constructs/Cdk");
const Lambda_1 = require("../../../Constructs/Lambda");
const constant_1 = require("../../../constant");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
templating_1.Generator.generate({
    outputFile: `${constant_1.PATH.test}${USER_WORKING_DIRECTORY}-lambda.test.ts`,
}, (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const cdk = new Cdk_1.Cdk(output);
    const iam = new Iam_1.Iam(output);
    const lambda = new Lambda_1.Lambda(output);
    const imp = new ConstructsImports_1.Imports(output);
    const { apiName, lambdaStyle, database, apiType } = model.api;
    let mutations = {};
    let queries = {};
    if (apiType === constant_1.APITYPE.graphql) {
        mutations = model.type.Mutation ? model.type.Mutation : {};
        queries = model.type.Query ? model.type.Query : {};
    }
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    imp.ImportsForTest(output, USER_WORKING_DIRECTORY);
    if (database === constant_1.DATABASE.dynamo) {
        imp.importForDynamodbConstructInTest(output);
        ts.writeLine();
    }
    cdk.initializeTest("Lambda Attach With Dynamodb Constructs Test", () => {
        ts.writeLine();
        if (database === constant_1.DATABASE.dynamo) {
            if (apiType === constant_1.APITYPE.rest || (lambdaStyle === constant_1.LAMBDASTYLE.single && apiType === constant_1.APITYPE.graphql)) {
                let funcName = `${apiName}Lambda`;
                iam.dynamodbConsturctIdentifier();
                ts.writeLine();
                iam.DynodbTableIdentifier();
                ts.writeLine();
                lambda.initializeTestForLambdaWithDynamoDB(funcName, "main");
                ts.writeLine();
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                iam.dynamodbConsturctIdentifier();
                ts.writeLine();
                iam.DynodbTableIdentifier();
                ts.writeLine();
                Object.keys(mutationsAndQueries).forEach((key) => {
                    let funcName = `${apiName}Lambda${key}`;
                    lambda.initializeTestForLambdaWithDynamoDB(funcName, key);
                    ts.writeLine();
                });
            }
        }
        iam.lambdaServiceRoleTest();
        ts.writeLine();
        if (apiType === constant_1.APITYPE.graphql) {
            if (lambdaStyle === constant_1.LAMBDASTYLE.single && database === constant_1.DATABASE.dynamo) {
                iam.lambdaServiceRolePolicyTestForDynodb(1);
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi && database === constant_1.DATABASE.dynamo) {
                iam.lambdaServiceRolePolicyTestForDynodb(Object.keys(mutationsAndQueries).length);
            }
        }
        else if (apiType === constant_1.APITYPE.rest && database === constant_1.DATABASE.dynamo) {
            iam.lambdaServiceRolePolicyTestForDynodb(1);
        }
        ts.writeLine();
    }, output, USER_WORKING_DIRECTORY);
});
