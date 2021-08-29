"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../utils/constant");
const ApiManager_1 = require("../../lib/ApiManager");
const Cdk_1 = require("../../lib/Cdk");
const ConstructsImports_1 = require("../../lib/ConstructsImports");
const functions_1 = require("./functions");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const _ = require("lodash");
templating_1.Generator.generate({
    outputFile: `${constant_1.PATH.lib}${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const { apiName, lambdaStyle, database, apiType } = model.api;
    let mutations = {};
    let queries = {};
    if (apiType === constant_1.APITYPE.graphql) {
        mutations = model.type.Mutation ? model.type.Mutation : {};
        queries = model.type.Query ? model.type.Query : {};
    }
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    const cdk = new Cdk_1.Cdk(output);
    const imp = new ConstructsImports_1.Imports(output);
    const manager = new ApiManager_1.apiManager(output);
    imp.importsForStack(output);
    imp.importApiManager(output);
    if (apiType === constant_1.APITYPE.graphql) {
        imp.importForAppsyncConstruct(output);
    }
    else {
        imp.importForApiGatewayConstruct(output);
    }
    imp.importForLambdaConstruct(output);
    if (database === constant_1.DATABASE.dynamo) {
        imp.importForDynamodbConstruct(output);
    }
    if (database === constant_1.DATABASE.neptune) {
        imp.importForNeptuneConstruct(output);
    }
    if (database === constant_1.DATABASE.aurora) {
        imp.importForAuroraDbConstruct(output);
    }
    ts.writeLine();
    cdk.initializeStack(`${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}`, () => {
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        if (database == constant_1.DATABASE.dynamo) {
            ts.writeVariableDeclaration({
                name: `${apiName}_table`,
                typeName: constant_1.CONSTRUCTS.dynamodb,
                initializer: () => {
                    ts.writeLine(`new ${constant_1.CONSTRUCTS.dynamodb}(this,"${apiName}${constant_1.CONSTRUCTS.dynamodb}")`);
                },
            }, "const");
            ts.writeLine();
        }
        else if (database == constant_1.DATABASE.neptune) {
            ts.writeVariableDeclaration({
                name: `${apiName}_neptunedb`,
                typeName: constant_1.CONSTRUCTS.neptuneDb,
                initializer: () => {
                    ts.writeLine(`new ${constant_1.CONSTRUCTS.neptuneDb}(this,"${apiName}${constant_1.CONSTRUCTS.neptuneDb}")`);
                },
            }, "const");
            ts.writeLine();
        }
        else if (database == constant_1.DATABASE.aurora) {
            ts.writeVariableDeclaration({
                name: `${apiName}_auroradb`,
                typeName: constant_1.CONSTRUCTS.auroradb,
                initializer: () => {
                    ts.writeLine(`new ${constant_1.CONSTRUCTS.auroradb}(this,"${constant_1.CONSTRUCTS.auroradb}");`);
                },
            }, "const");
            ts.writeLine();
        }
        ts.writeVariableDeclaration({
            name: `${apiName}Lambda`,
            typeName: constant_1.CONSTRUCTS.lambda,
            initializer: () => {
                ts.writeLine(`new ${constant_1.CONSTRUCTS.lambda}(this,"${apiName}${constant_1.CONSTRUCTS.lambda}",{`);
                database === constant_1.DATABASE.dynamo &&
                    (0, functions_1.lambdaPropsHandlerDynamodb)(output, `${apiName}_table`);
                database === constant_1.DATABASE.neptune &&
                    (0, functions_1.lambdaConstructPropsHandlerNeptunedb)(output, apiName);
                database === constant_1.DATABASE.aurora &&
                    (0, functions_1.lambdaConstructPropsHandlerAuroradb)(output, apiName);
                ts.writeLine("})");
            },
        }, "const");
        database === constant_1.DATABASE.dynamo &&
            (0, functions_1.LambdaAccessHandler)(output, apiName, lambdaStyle, apiType, mutationsAndQueries);
        if (apiType === constant_1.APITYPE.graphql) {
            ts.writeVariableDeclaration({
                name: `${apiName}`,
                typeName: constant_1.CONSTRUCTS.appsync,
                initializer: () => {
                    ts.writeLine(`new ${constant_1.CONSTRUCTS.appsync}(this,"${apiName}${constant_1.CONSTRUCTS.appsync}",{`);
                    database === constant_1.DATABASE.dynamo &&
                        (0, functions_1.propsHandlerForAppsyncConstructDynamodb)(output, apiName, lambdaStyle, mutationsAndQueries);
                    database === constant_1.DATABASE.neptune &&
                        (0, functions_1.propsHandlerForAppsyncConstructNeptunedb)(output, apiName, lambdaStyle, mutationsAndQueries);
                    database === constant_1.DATABASE.aurora &&
                        (0, functions_1.propsHandlerForAppsyncConstructNeptunedb)(output, apiName, lambdaStyle, mutationsAndQueries);
                    ts.writeLine("})");
                },
            }, "const");
        }
        if (apiType === constant_1.APITYPE.rest) {
            ts.writeLine(`const ${apiName} = new ${constant_1.CONSTRUCTS.apigateway}(this,"${apiName}${constant_1.CONSTRUCTS.apigateway}",{`);
            (0, functions_1.propsHandlerForApiGatewayConstruct)(output, apiName);
            ts.writeLine("})");
        }
    }, output);
});
