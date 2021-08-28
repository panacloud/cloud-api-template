"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Imports = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../constant");
class Imports extends core_1.CodeWriter {
    importsForStack(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
        ts.writeImports("constructs", ["Construct"]);
    }
    importAppsync(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_appsync as appsync"]);
    }
    importDynamodb(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_dynamodb as dynamodb"]);
    }
    importRds(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_rds as rds"]);
    }
    importIam(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_iam as iam"]);
    }
    importLambda(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_lambda as lambda"]);
    }
    importNeptune(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_neptune as neptune"]);
    }
    importApiManager(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("panacloud-manager", ["PanacloudManager"]);
    }
    importsForTags(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["Tags"]);
    }
    importEc2(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_ec2 as ec2"]);
    }
    importForAppsyncConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`./${constant_1.CONSTRUCTS.appsync}`, [constant_1.CONSTRUCTS.appsync]);
    }
    importForApiGatewayConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`./${constant_1.CONSTRUCTS.apigateway}`, [constant_1.CONSTRUCTS.apigateway]);
    }
    importForDynamodbConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`./${constant_1.CONSTRUCTS.dynamodb}`, [constant_1.CONSTRUCTS.dynamodb]);
    }
    importForLambdaConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`./${constant_1.CONSTRUCTS.lambda}`, [constant_1.CONSTRUCTS.lambda]);
    }
    importForNeptuneConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`./${constant_1.CONSTRUCTS.neptuneDb}`, [constant_1.CONSTRUCTS.neptuneDb]);
    }
    importForAuroraDbConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`./${constant_1.CONSTRUCTS.auroradb}`, [constant_1.CONSTRUCTS.auroradb]);
    }
    importForAppsyncConstructInTest(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${constant_1.CONSTRUCTS.appsync}`, [constant_1.CONSTRUCTS.appsync]);
    }
    importForDynamodbConstructInTest(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${constant_1.CONSTRUCTS.dynamodb}`, [constant_1.CONSTRUCTS.dynamodb]);
    }
    importForLambdaConstructInTest(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${constant_1.CONSTRUCTS.lambda}`, [constant_1.CONSTRUCTS.lambda]);
    }
    importForNeptuneConstructInTest(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${constant_1.CONSTRUCTS.neptuneDb}`, [constant_1.CONSTRUCTS.neptuneDb]);
    }
    importForAuroraDbConstructInTest(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${constant_1.CONSTRUCTS.auroradb}`, [constant_1.CONSTRUCTS.auroradb]);
    }
    ImportsForTest(output, workingDir) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", "cdk");
        ts.writeImports("@aws-cdk/assert", [
            "countResources",
            "haveResource",
            "expect",
            "countResourcesLike",
        ]);
        ts.writeImports(`../lib/${workingDir}-stack`, workingDir);
    }
    ImportsForTest2(output, workingDir) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports('aws-cdk-lib', 'cdk');
        ts.writeLine(`import "@aws-cdk/assert/jest"`);
    }
}
exports.Imports = Imports;
