"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propsHandlerForDynamoDbConstruct = exports.propsHandlerForApiGatewayConstruct = exports.LambdaAccessHandler = exports.propsHandlerForAppsyncConstructNeptunedb = exports.propsHandlerForAppsyncConstructDynamodb = exports.lambdaConstructPropsHandlerAuroradb = exports.lambdaConstructPropsHandlerNeptunedb = exports.lambdaPropsHandlerDynamodb = exports.lambdaEnvHandler = void 0;
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../../util/constant");
const DynamoDB_1 = require("../../../Constructs/DynamoDB");
const lambdaEnvHandler = (output, apiName, lambdaStyle, mutationsAndQueries) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    let apiLambda = apiName + "Lambda";
    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
        let lambdafunc = `${apiName}_lambdaFn`;
        ts.writeLine(`${apiLambda}.${lambdafunc}.addEnvironment("TABLE_NAME",${apiName}_table.tableName)`);
        ts.writeLine();
    }
    if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            let lambdafunc = `${apiName}_lambdaFn_${key}`;
            ts.writeLine(`${apiLambda}.${lambdafunc}.addEnvironment("TABLE_NAME",${apiName}_table.tableName)`);
            ts.writeLine();
        });
    }
};
exports.lambdaEnvHandler = lambdaEnvHandler;
const lambdaPropsHandlerDynamodb = (output, dbConstructName) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`tableName:${dbConstructName}.table.tableName`);
    ts.writeLine();
};
exports.lambdaPropsHandlerDynamodb = lambdaPropsHandlerDynamodb;
const lambdaConstructPropsHandlerNeptunedb = (output, apiName) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`SGRef:${apiName}_neptunedb.SGRef,`);
    ts.writeLine(`VPCRef:${apiName}_neptunedb.VPCRef,`);
    ts.writeLine(`neptuneReaderEndpoint:${apiName}_neptunedb.neptuneReaderEndpoint`);
};
exports.lambdaConstructPropsHandlerNeptunedb = lambdaConstructPropsHandlerNeptunedb;
const lambdaConstructPropsHandlerAuroradb = (output, apiName) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`secretRef:${apiName}_auroradb.secretRef,`);
    ts.writeLine(`vpcRef:${apiName}_auroradb.vpcRef,`);
    ts.writeLine(`serviceRole: ${apiName}_auroradb.serviceRole`);
};
exports.lambdaConstructPropsHandlerAuroradb = lambdaConstructPropsHandlerAuroradb;
const propsHandlerForAppsyncConstructDynamodb = (output, apiName, lambdaStyle, mutationsAndQueries) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
        let apiLambda = apiName + "Lambda";
        let lambdafunc = `${apiName}_lambdaFn`;
        ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn`);
    }
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            let apiLambda = `${apiName}Lambda`;
            let lambdafunc = `${apiName}_lambdaFn_${key}`;
            ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn,`);
        });
    }
};
exports.propsHandlerForAppsyncConstructDynamodb = propsHandlerForAppsyncConstructDynamodb;
const propsHandlerForAppsyncConstructNeptunedb = (output, apiName, lambdaStyle, mutationsAndQueries) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
        let apiLambda = apiName + "Lambda";
        let lambdafunc = `${apiName}_lambdaFnArn`;
        ts.writeLine(`${lambdafunc} : ${apiLambda}.${lambdafunc}`);
    }
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            let apiLambda = `${apiName}Lambda`;
            let lambdafunc = `${apiName}_lambdaFn_${key}`;
            ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}Arn,`);
        });
    }
};
exports.propsHandlerForAppsyncConstructNeptunedb = propsHandlerForAppsyncConstructNeptunedb;
const LambdaAccessHandler = (output, apiName, lambdaStyle, apiType, mutationsAndQueries) => {
    const dynamodb = new DynamoDB_1.DynamoDB(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === constant_1.LAMBDASTYLE.single || apiType === constant_1.APITYPE.rest) {
        dynamodb.dbConstructLambdaAccess(apiName, `${apiName}_table`, `${apiName}Lambda`, lambdaStyle, apiType);
        ts.writeLine();
    }
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi && apiType === constant_1.APITYPE.graphql) {
        Object.keys(mutationsAndQueries).forEach((key) => {
            dynamodb.dbConstructLambdaAccess(apiName, `${apiName}_table`, `${apiName}Lambda`, lambdaStyle, apiType, key);
        });
        ts.writeLine();
    }
};
exports.LambdaAccessHandler = LambdaAccessHandler;
const propsHandlerForApiGatewayConstruct = (output, apiName) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    let lambdafunc = `${apiName}_lambdaFn`;
    ts.writeLine(`${lambdafunc}: ${apiName}Lambda.${lambdafunc}`);
};
exports.propsHandlerForApiGatewayConstruct = propsHandlerForApiGatewayConstruct;
const propsHandlerForDynamoDbConstruct = (output, apiName, lambdaStyle, mutationsAndQueries) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
        let lambdafunc = `${apiName}_lambdaFn`;
        ts.writeLine(`${lambdafunc}: ${apiName}Lambda.${lambdafunc}`);
    }
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            let lambdafunc = `${apiName}_lambdaFn_${key}`;
            ts.writeLine(`${lambdafunc} : ${apiName}Lambda.${lambdafunc},`);
        });
    }
};
exports.propsHandlerForDynamoDbConstruct = propsHandlerForDynamoDbConstruct;
