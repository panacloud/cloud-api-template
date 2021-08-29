"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appsyncResolverhandler = exports.appsyncDatasourceHandler = void 0;
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../../../utils/constant");
const Appsync_1 = require("../../../../lib/Appsync");
const Cdk_1 = require("../../../../lib/Cdk");
const model = require("../../../../../../model.json");
const appsyncDatasourceHandler = (apiName, output, lambdaStyle, mutationsAndQueries) => {
    const appsync = new Appsync_1.Appsync(output);
    appsync.apiName = apiName;
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
        appsync.appsyncLambdaDataSource(output, apiName, apiName, lambdaStyle);
    }
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
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
const appsyncResolverhandler = (apiName, output, lambdaStyle) => {
    var _a, _b, _c, _d;
    const appsync = new Appsync_1.Appsync(output);
    appsync.apiName = apiName;
    const cdk = new Cdk_1.Cdk(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
        for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
            if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}`, output);
                ts.writeLine();
                cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
                cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}`);
                ts.writeLine();
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
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
            if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
                appsync.appsyncLambdaResolver(key, "Mutation", `ds_${apiName}`, output);
                ts.writeLine();
                cdk.nodeAddDependency(`${key}_resolver`, `${apiName}_schema`);
                cdk.nodeAddDependency(`${key}_resolver`, `ds_${apiName}`);
                ts.writeLine();
            }
            else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
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
