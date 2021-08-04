"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appsyncResolverhandler = exports.appsyncDatasourceHandler = void 0;
const cloud_api_constants_1 = require("../../../../cloud-api-constants");
const typescript_1 = require("@yellicode/typescript");
const Appsync_1 = require("../../../../Constructs/Appsync");
const model = require("../../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { apiName, lambdaStyle, database } = model.api;
const mutations = model.type.Mutation ? model.type.Mutation : {};
const queries = model.type.Query ? model.type.Query : {};
const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
const appsyncDatasourceHandler = (output) => {
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
const appsyncResolverhandler = (output) => {
    var _a, _b, _c, _d;
    const appsync = new Appsync_1.Appsync(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
        for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
            if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}`, output);
            }
            else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}_${key}`, output);
            }
        }
        ts.writeLine();
    }
    if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
        for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
            if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                appsync.appsyncLambdaResolver(key, "Mutation", `ds_${apiName}`, output);
            }
            else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                appsync.appsyncLambdaResolver(key, "Mutation", `ds_${apiName}_${key}`, output);
            }
        }
        ts.writeLine();
    }
};
exports.appsyncResolverhandler = appsyncResolverhandler;
