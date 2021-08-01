"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Appsync_1 = require("../../functions/Appsync");
const iam_1 = require("../../functions/iam");
const index_1 = require("../../functions/constructsTest/index");
const jsonObj = require(`../../model.json`);
const { USER_WORKING_DIRECTORY, API_NAME, LAMBDA_STYLE } = jsonObj;
const API_TYPE = "GRAPHQL";
if (API_TYPE === "GRAPHQL") {
    templating_1.Generator.generateFromModel({
        outputFile: `../../../${USER_WORKING_DIRECTORY}/test/${USER_WORKING_DIRECTORY}-appsync.test.ts`,
    }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const iam = new iam_1.Iam(output);
        const appsync = new Appsync_1.Appsync(output);
        const testClass = new index_1.TestingConstructs(output);
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        testClass.ImportsForTest(output);
        testClass.initializeTest("Appsync Api Constructs Test", () => {
            var _a, _b, _c, _d;
            appsync.apiName = API_NAME;
            appsync.appsyncApiTest();
            ts.writeLine();
            appsync.appsyncApiKeyTest();
            ts.writeLine();
            iam.appsyncServiceRoleTest();
            ts.writeLine();
            iam.roleIdentifierFromStack();
            ts.writeLine();
            iam.appsyncRolePolicyTest();
            ts.writeLine();
            iam.lambdaIdentifierFromStack();
            ts.writeLine();
            if (LAMBDA_STYLE === "single lambda") {
                let dsName = `${API_NAME}_dataSource`;
                appsync.appsyncDatasourceTest(dsName, 0);
            }
            else if (LAMBDA_STYLE === "multiple lambda" && mutationsAndQueries) {
                Object.keys(mutationsAndQueries).forEach((key, index) => {
                    if (LAMBDA_STYLE === "multiple lambda") {
                        let dsName = `${API_NAME}_dataSource_${key}`;
                        appsync.appsyncDatasourceTest(dsName, index);
                        ts.writeLine();
                    }
                });
            }
            ts.writeLine();
            if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
                for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
                    if (LAMBDA_STYLE === "single lambda") {
                        appsync.appsyncResolverTest(key, "Query", `${API_NAME}_dataSource`);
                    }
                    if (LAMBDA_STYLE === "multiple lambda") {
                        appsync.appsyncResolverTest(key, "Query", `${API_NAME}_dataSource_${key}`);
                        ts.writeLine();
                    }
                }
            }
            ts.writeLine();
            if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
                for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
                    if (LAMBDA_STYLE === "single lambda") {
                        appsync.appsyncResolverTest(key, "Mutation", `${API_NAME}_dataSource`);
                        ts.writeLine();
                    }
                    if (LAMBDA_STYLE === "multiple lambda") {
                        appsync.appsyncResolverTest(key, "Mutation", `${API_NAME}_dataSource_${key}`);
                        ts.writeLine();
                    }
                }
            }
        }, output);
    });
}
