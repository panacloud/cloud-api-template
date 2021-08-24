"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Iam_1 = require("../../../Constructs/Iam");
const Cdk_1 = require("../../../Constructs/Cdk");
const Lambda_1 = require("../../../Constructs/Lambda");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
if ((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.lambdaStyle) {
    templating_1.Generator.generateFromModel({
        outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-lambda.test.ts`,
    }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new Cdk_1.Cdk(output);
        const iam = new Iam_1.Iam(output);
        const lambda = new Lambda_1.Lambda(output);
        const cdk = new Cdk_1.Cdk(output);
        const { apiName, lambdaStyle, database } = model.api;
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        if (database && database === cloud_api_constants_1.DATABASE.dynamoDb) {
            testClass.ImportsForTest(output, USER_WORKING_DIRECTORY);
            cdk.importForDynamodbConstruct(output);
            ts.writeLine();
            testClass.initializeTest('Lambda Attach With Dynamodb Constructs Test', () => {
                ts.writeLine();
                iam.dynamodbConsturctIdentifier();
                ts.writeLine();
                iam.DynodbTableIdentifier();
                ts.writeLine();
                if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                    let funcName = `${apiName}Lambda`;
                    lambda.initializeTestForLambdaWithDynamoDB(funcName, 'main');
                    ts.writeLine();
                }
                else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                    Object.keys(mutationsAndQueries).forEach((key) => {
                        let funcName = `${apiName}Lambda${key}`;
                        lambda.initializeTestForLambdaWithDynamoDB(funcName, key);
                        ts.writeLine();
                    });
                }
                iam.lambdaServiceRoleTest();
                ts.writeLine();
                if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                    iam.lambdaServiceRolePolicyTestForDynodb(1);
                }
                else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                    iam.lambdaServiceRolePolicyTestForDynodb(Object.keys(mutationsAndQueries).length);
                }
                ts.writeLine();
            }, output, USER_WORKING_DIRECTORY);
        }
        else if (database && database === cloud_api_constants_1.DATABASE.neptuneDb) {
            testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY);
            cdk.importForLambdaConstruct(output);
            cdk.importForNeptuneConstruct(output);
            ts.writeLine();
            testClass.initializeTest2("Lambda Attach With NeptuneDB Constructs Test", () => {
                ts.writeLine();
                ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct-stack.VPCRef.isolatedSubnets;`);
                ts.writeLine();
                ts.writeLine(`const LambdaConstruct-stack = new LambdaConstruct(stack, 'LambdaConstructTest', {`);
                ts.writeLine(`VPCRef: VpcNeptuneConstruct-stack.VPCRef,`);
                ts.writeLine(`SGRef: VpcNeptuneConstruct-stack.SGRef,`);
                ts.writeLine(`neptuneReaderEndpoint: VpcNeptuneConstruct-stack.neptuneReaderEndpoint,`);
                ts.writeLine(`});`);
                ts.writeLine();
                ts.writeLine(`const cfn_cluster = VpcNeptuneConstruct-stack.node.children.filter(`);
                ts.writeLine(`(elem) => elem instanceof cdk.aws_neptune.CfnDBCluster`);
                ts.writeLine(`);`);
                ts.writeLine();
                if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                    let funcName = `${apiName}Lambda`;
                    lambda.initializeTestForLambdaWithNeptune(funcName, 'main');
                }
                else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                    Object.keys(mutationsAndQueries).forEach((key) => {
                        let funcName = `${apiName}Lambda${key}`;
                        lambda.initializeTestForLambdaWithNeptune(funcName, key);
                        ts.writeLine();
                    });
                }
            }, output, cloud_api_constants_1.CONSTRUCTS.lambda);
        }
    });
}
