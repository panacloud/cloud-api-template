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
    const { apiName, lambdaStyle, database, apiType } = model.api;
    const imp = new ConstructsImports_1.Imports(output);
    let mutations = {};
    let queries = {};
    if (apiType === constant_1.APITYPE.graphql) {
        mutations = model.type.Mutation ? model.type.Mutation : {};
        queries = model.type.Query ? model.type.Query : {};
    }
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    // imp.ImportsForTest(output,USER_WORKING_DIRECTORY);
    // if (database && database === DATABASE.dynamoDb) {
    //   testClass.ImportsForTest(output, USER_WORKING_DIRECTORY);
    //   cdk.importForDynamodbConstruct(output);
    // const { apiName, lambdaStyle, database ,apiType } = model.api;
    if (database === constant_1.DATABASE.dynamo) {
        imp.ImportsForTest(output, USER_WORKING_DIRECTORY, 'pattern1');
        imp.importForDynamodbConstructInTest(output);
        ts.writeLine();
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
        }, output, USER_WORKING_DIRECTORY, 'pattern1');
    }
    else if (database === constant_1.DATABASE.neptune) {
        imp.ImportsForTest(output, USER_WORKING_DIRECTORY, 'pattern2');
        imp.importForNeptuneConstructInTest(output);
        imp.importForLambdaConstructInTest(output);
        ts.writeLine();
        // } else if (database && database === DATABASE.neptuneDb){
        //     cdk.ImportsForTest2(output, USER_WORKING_DIRECTORY)
        //     cdk.importForLambdaConstruct(output)
        //     cdk.importForNeptuneConstruct(output)
        //     ts.writeLine();
        cdk.initializeTest("Lambda Attach With NeptuneDB Constructs Test", () => {
            ts.writeLine();
            iam.constructorIdentifier(constant_1.CONSTRUCTS.neptuneDb);
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
            if (apiType === constant_1.APITYPE.rest || (lambdaStyle === constant_1.LAMBDASTYLE.single && apiType === constant_1.APITYPE.graphql)) {
                let funcName = `${apiName}Lambda`;
                lambda.initializeTestForLambdaWithNeptune(funcName, 'main');
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    let funcName = `${apiName}Lambda${key}`;
                    lambda.initializeTestForLambdaWithNeptune(funcName, key);
                    ts.writeLine();
                });
            }
        }, output, USER_WORKING_DIRECTORY, 'pattern2');
    }
    else if (database === constant_1.DATABASE.aurora) {
        imp.ImportsForTest(output, USER_WORKING_DIRECTORY, 'pattern2');
        imp.importForAuroraDbConstructInTest(output);
        imp.importForLambdaConstructInTest(output);
        ts.writeLine();
        cdk.initializeTest("Lambda Attach With NeptuneDB Constructs Test", () => {
            ts.writeLine();
            iam.constructorIdentifier(constant_1.CONSTRUCTS.auroradb);
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
            if (apiType === constant_1.APITYPE.rest || (lambdaStyle === constant_1.LAMBDASTYLE.single && apiType === constant_1.APITYPE.graphql)) {
                let funcName = `${apiName}Lambda`;
                lambda.initializeTestForLambdaWithAuroradb(funcName, 'main');
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    let funcName = `${apiName}Lambda${key}`;
                    lambda.initializeTestForLambdaWithAuroradb(funcName, key);
                    ts.writeLine();
                });
            }
        }, output, USER_WORKING_DIRECTORY, 'pattern2');
    }
    // } else if (database && database === DATABASE.auroraDb) {
    //   testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY)
    //   cdk.importForLambdaConstruct(output)
    //   cdk.importForAuroradbConstruct(output)
    //   ts.writeLine();
    //   testClass.initializeTest2('Lambda Attach With AuororaDB Constructs Test', () => {
    //     if(lambdaStyle === LAMBDA.single){
    //       let funcName = `${apiName}Lambda`;
    //       lambda.initializeTestForLambdaWithAuroradb(funcName, 'main')
    //     } else if(lambdaStyle === LAMBDA.multiple){
    //       Object.keys(mutationsAndQueries).forEach((key) => {
    //         let funcName = `${apiName}Lambda${key}`;
    //         lambda.initializeTestForLambdaWithAuroradb(funcName, key)
    //         ts.writeLine()
    //       })
    //     }
    //   }, output, CONSTRUCTS.auroradb)
    // }
});
// ts.writeLine();
//   testClass.initializeTest(
//     'Lambda Attach With Dynamodb Constructs Test',
//     () => {
//       ts.writeLine();
//       iam.dynamodbConsturctIdentifier();
//       ts.writeLine();
//       iam.DynodbTableIdentifier();
//       ts.writeLine();
//       if (lambdaStyle === LAMBDA.single) {
//         let funcName = `${apiName}Lambda`;
//         lambda.initializeTestForLambdaWithDynamoDB(funcName, 'main');
//         ts.writeLine();
//       } else if (lambdaStyle === LAMBDA.multiple) {
//         Object.keys(mutationsAndQueries).forEach((key) => {
//           let funcName = `${apiName}Lambda${key}`;
//           lambda.initializeTestForLambdaWithDynamoDB(funcName, key);
//           ts.writeLine();
//         });
//       }
//       iam.lambdaServiceRoleTest();
//       ts.writeLine();
//       if (lambdaStyle === LAMBDA.single) {
//         iam.lambdaServiceRolePolicyTestForDynodb(1);
//       } else if (lambdaStyle === LAMBDA.multiple) {
//         iam.lambdaServiceRolePolicyTestForDynodb(
//           Object.keys(mutationsAndQueries).length
//         );
//       }
//       ts.writeLine();
//     },
//     output,
//     USER_WORKING_DIRECTORY
//   );
