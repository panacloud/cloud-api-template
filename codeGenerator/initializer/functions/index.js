"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propsHandlerForDynoDbConstruct = exports.propsHandlerForAppsyncConstruct = exports.lambdaEnvHandler = void 0;
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const lambdaEnvHandler = (output, apiName, lambdaStyle, mutationsAndQueries) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    let apiLambda = apiName + "Lambda";
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        let lambdafunc = `${apiName}_lambdaFn`;
        ts.writeLine(`${apiLambda}.${lambdafunc}.addEnvironment("TABLE_NAME",${apiName}_table.tableName)`);
        ts.writeLine();
    }
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            let lambdafunc = `${apiName}_lambdaFn_${key}`;
            ts.writeLine(`${apiLambda}.${lambdafunc}.addEnvironment("TABLE_NAME",${apiName}_table.tableName)`);
            ts.writeLine();
        });
    }
};
exports.lambdaEnvHandler = lambdaEnvHandler;
const propsHandlerForAppsyncConstruct = (output, apiName, lambdaStyle, mutationsAndQueries) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        let apiLambda = apiName + "Lambda";
        let lambdafunc = `${apiName}_lambdaFn`;
        ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn`);
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            let apiLambda = `${apiName}Lambda`;
            let lambdafunc = `${apiName}_lambdaFn_${key}`;
            ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn,`);
        });
    }
};
exports.propsHandlerForAppsyncConstruct = propsHandlerForAppsyncConstruct;
const propsHandlerForDynoDbConstruct = (output, apiName, lambdaStyle, mutationsAndQueries) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        let lambdafunc = `${apiName}_lambdaFn`;
        ts.writeLine(`${lambdafunc}: ${apiName}Lambda.${lambdafunc}`);
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        // var dbProps: { [k: string]: string } = {};
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            let lambdafunc = `${apiName}_lambdaFn_${key}`;
            ts.writeLine(`${lambdafunc} : ${apiName}Lambda.${lambdafunc},`);
        });
        // return dbProps
    }
};
exports.propsHandlerForDynoDbConstruct = propsHandlerForDynoDbConstruct;
