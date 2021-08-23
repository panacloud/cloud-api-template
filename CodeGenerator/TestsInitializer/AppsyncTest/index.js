"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Appsync_1 = require("../../../Constructs/Appsync");
const Iam_1 = require("../../../Constructs/Iam");
const Cdk_1 = require("../../../Constructs/Cdk");
<<<<<<< HEAD
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
if (((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.apiType) === cloud_api_constants_1.APITYPE.graphql) {
    templating_1.Generator.generate({
        outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-appsync.test.ts`,
    }, (output) => {
        const { apiName, lambdaStyle, database } = model.api;
=======
const constant_1 = require("../../../constant");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const { apiType } = model.api;
if (apiType === constant_1.APITYPE.graphql) {
    templating_1.Generator.generate({
        outputFile: `${constant_1.PATH.test}${USER_WORKING_DIRECTORY}-appsync.test.ts`,
    }, (output) => {
        const { apiName, lambdaStyle } = model.api;
>>>>>>> dev
        const ts = new typescript_1.TypeScriptWriter(output);
        const iam = new Iam_1.Iam(output);
        const appsync = new Appsync_1.Appsync(output);
        const imp = new ConstructsImports_1.Imports(output);
        const testClass = new Cdk_1.Cdk(output);
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        imp.ImportsForTest(output, USER_WORKING_DIRECTORY);
        imp.importForAppsyncConstructInTest(output);
        imp.importForLambdaConstructInTest(output);
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
            if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                let dsName = `${apiName}_dataSource`;
                appsync.appsyncDatasourceTest(dsName, 0);
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi && mutationsAndQueries) {
                Object.keys(mutationsAndQueries).forEach((key, index) => {
                    if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                        let dsName = `${apiName}_dataSource_${key}`;
                        appsync.appsyncDatasourceTest(dsName, index);
                        ts.writeLine();
                    }
                });
            }
            ts.writeLine();
            if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
                for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
                    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                        appsync.appsyncResolverTest(key, "Query", `${apiName}_dataSource`);
                    }
                    if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                        appsync.appsyncResolverTest(key, "Query", `${apiName}_dataSource_${key}`);
                        ts.writeLine();
                    }
                }
            }
            ts.writeLine();
            if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
                for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
                    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                        appsync.appsyncResolverTest(key, "Mutation", `${apiName}_dataSource`);
                        ts.writeLine();
                    }
                    if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
                        appsync.appsyncResolverTest(key, "Mutation", `${apiName}_dataSource_${key}`);
                        ts.writeLine();
                    }
                }
            }
        }, output, USER_WORKING_DIRECTORY);
    });
}
