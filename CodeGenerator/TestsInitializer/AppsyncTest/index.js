"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Appsync_1 = require("../../../Constructs/Appsync");
const Iam_1 = require("../../../Constructs/Iam");
const Cdk_1 = require("../../../Constructs/Cdk");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const jsonObj = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = jsonObj;
const API_TYPE = "GRAPHQL";
if (API_TYPE === "GRAPHQL") {
    templating_1.Generator.generateFromModel({
        outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-appsync.test.ts`,
    }, (output, model) => {
        const { apiName, lambdaStyle, database } = model.api;
        const ts = new typescript_1.TypeScriptWriter(output);
        const iam = new Iam_1.Iam(output);
        const appsync = new Appsync_1.Appsync(output);
        const cdk = new Cdk_1.Cdk(output);
        const testClass = new Cdk_1.Cdk(output);
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        testClass.ImportsForTest(output, USER_WORKING_DIRECTORY);
        cdk.importForAppsyncConstruct(output);
        cdk.importForLambdaConstruct(output);
        testClass.initializeTest("Appsync Api Constructs Test", () => {
            var _a, _b, _c, _d;
            appsync.apiName = apiName;
            iam.appsyncConsturctIdentifier();
            ts.writeLine();
            iam.appsyncApiIdentifier();
            ts.writeLine();
            appsync.appsyncApiTest();
            ts.writeLine();
            appsync.appsyncApiKeyTest();
            ts.writeLine();
            iam.appsyncRoleIdentifier();
            ts.writeLine();
            iam.appsyncServiceRoleTest();
            ts.writeLine();
            iam.appsyncRolePolicyTest();
            ts.writeLine();
            iam.lambdaConsturctIdentifier();
            ts.writeLine();
            iam.lambdaIdentifier();
            ts.writeLine();
            if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                let dsName = `${apiName}_dataSource`;
                appsync.appsyncDatasourceTest(dsName, 0);
            }
            else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple && mutationsAndQueries) {
                Object.keys(mutationsAndQueries).forEach((key, index) => {
                    if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                        let dsName = `${apiName}_dataSource_${key}`;
                        appsync.appsyncDatasourceTest(dsName, index);
                        ts.writeLine();
                    }
                });
            }
            ts.writeLine();
            if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
                for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
                    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                        appsync.appsyncResolverTest(key, "Query", `${apiName}_dataSource`);
                    }
                    if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                        appsync.appsyncResolverTest(key, "Query", `${apiName}_dataSource_${key}`);
                        ts.writeLine();
                    }
                }
            }
            ts.writeLine();
            if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
                for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
                    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                        appsync.appsyncResolverTest(key, "Mutation", `${apiName}_dataSource`);
                        ts.writeLine();
                    }
                    if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                        appsync.appsyncResolverTest(key, "Mutation", `${apiName}_dataSource_${key}`);
                        ts.writeLine();
                    }
                }
            }
        }, output, USER_WORKING_DIRECTORY);
    });
}
