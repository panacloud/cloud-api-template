"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appsyncResolverhandler = exports.appsyncDatasourceHandler = void 0;
const cloud_api_constants_1 = require("../../../../cloud-api-constants");
const typescript_1 = require("@yellicode/typescript");
const Appsync_1 = require("../../../../Constructs/Appsync");
const Cdk_1 = require("../../../../Constructs/Cdk");
const model = require("../../../../model.json");
const { lambdaStyle } = model.api;
const mutations = model.type.Mutation ? model.type.Mutation : {};
const queries = model.type.Query ? model.type.Query : {};
const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
const appsyncDatasourceHandler = (apiName, output) => {
    const appsync = new Appsync_1.Appsync(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        appsync.appsyncLambdaDataSource(output, apiName, apiName, lambdaStyle);
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            appsync.appsyncLambdaDataSource(output, apiName, apiName, lambdaStyle, key);
            ts.writeLine();
        });
    }
    else {
        ts.writeLine();
    }
};
exports.appsyncDatasourceHandler = appsyncDatasourceHandler;
const appsyncResolverhandler = (apiName, output) => {
    var _a, _b, _c, _d;
    const appsync = new Appsync_1.Appsync(output);
    appsync.apiName = apiName;
    const cdk = new Cdk_1.Cdk(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
        for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
            if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}`, output);
                ts.writeLine();
                cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
                cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}`);
                ts.writeLine();
            }
            else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}_${key}`, output);
                ts.writeLine();
                cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
                cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}_${key}`);
                ts.writeLine();
            }
        }
        ts.writeLine();
    }
    if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
        for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
            if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                appsync.appsyncLambdaResolver(key, "Mutation", `ds_${apiName}`, output);
                ts.writeLine();
                cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
                cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}`);
                ts.writeLine();
            }
            else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                appsync.appsyncLambdaResolver(key, "Mutation", `ds_${apiName}_${key}`, output);
                ts.writeLine();
                cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
                cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}_${key}`);
                ts.writeLine();
            }
        }
        ts.writeLine();
    }
};
exports.appsyncResolverhandler = appsyncResolverhandler;
