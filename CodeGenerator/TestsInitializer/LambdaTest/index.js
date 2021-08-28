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
<<<<<<< HEAD
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
=======
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
>>>>>>> dev
                iam.dynamodbConsturctIdentifier();
                ts.writeLine();
                iam.DynodbTableIdentifier();
                ts.writeLine();
<<<<<<< HEAD
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
                ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`);
                ts.writeLine();
                ts.writeLine(`const LambdaConstruct_stack = new LambdaConstruct(stack, 'LambdaConstructTest', {`);
                ts.writeLine(`VPCRef: VpcNeptuneConstruct_stack.VPCRef,`);
                ts.writeLine(`SGRef: VpcNeptuneConstruct_stack.SGRef,`);
                ts.writeLine(`neptuneReaderEndpoint: VpcNeptuneConstruct_stack.neptuneReaderEndpoint,`);
                ts.writeLine(`});`);
                ts.writeLine();
                ts.writeLine(`const cfn_cluster = VpcNeptuneConstruct_stack.node.children.filter(`);
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
            }, output, cloud_api_constants_1.CONSTRUCTS.neptuneDb);
        }
        else if (database && database === cloud_api_constants_1.DATABASE.auroraDb) {
            testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY);
            cdk.importForLambdaConstruct(output);
            cdk.importForAuroradbConstruct(output);
            ts.writeLine();
            testClass.initializeTest2('Lambda Attach With AuororaDB Constructs Test', () => {
                ts.writeLine(`const LambdaConstruct_stack = new LambdaConstruct(stack, 'LambdaConstructTest', {`);
                ts.writeLine(`vpcRef: AuroraDbConstruct_stack.vpcRef,`);
                ts.writeLine(`secretRef: AuroraDbConstruct_stack.secretRef,`);
                ts.writeLine(`serviceRole: AuroraDbConstruct_stack.serviceRole,`);
                ts.writeLine(`});`);
                ts.writeLine();
                iam.serverlessClusterIdentifier();
                ts.writeLine();
                iam.secretIdentifier();
                ts.writeLine();
                iam.secretAttachment();
                ts.writeLine();
                if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                    let funcName = `${apiName}Lambda`;
                    lambda.initializeTestForLambdaWithAuroradb(funcName, 'main');
                }
                else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                    Object.keys(mutationsAndQueries).forEach((key) => {
                        let funcName = `${apiName}Lambda${key}`;
                        lambda.initializeTestForLambdaWithAuroradb(funcName, key);
                        ts.writeLine();
                    });
                }
            }, output, cloud_api_constants_1.CONSTRUCTS.auroradb);
        }
    });
}
=======
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
>>>>>>> dev
