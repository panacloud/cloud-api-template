"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Imports = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
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
        ts.writeImports(`../lib/${cloud_api_constants_1.CONSTRUCTS.appsync}`, [cloud_api_constants_1.CONSTRUCTS.appsync]);
    }
    importForDynamodbConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${cloud_api_constants_1.CONSTRUCTS.dynamodb}`, [cloud_api_constants_1.CONSTRUCTS.dynamodb]);
    }
    importForLambdaConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${cloud_api_constants_1.CONSTRUCTS.lambda}`, [cloud_api_constants_1.CONSTRUCTS.lambda]);
    }
    importForNeptuneConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.neptuneDb}`, [cloud_api_constants_1.CONSTRUCTS.neptuneDb]);
    }
    importForAuroraDbConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.auroradb}`, [cloud_api_constants_1.CONSTRUCTS.auroradb]);
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
}
exports.Imports = Imports;
