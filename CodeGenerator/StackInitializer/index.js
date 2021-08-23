"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../constant");
const ApiManager_1 = require("../../Constructs/ApiManager");
const Cdk_1 = require("../../Constructs/Cdk");
const ConstructsImports_1 = require("../../Constructs/ConstructsImports");
const functions_1 = require("./functions");
<<<<<<< HEAD
const jsonObj = require("../../model.json");
const { USER_WORKING_DIRECTORY } = jsonObj;
=======
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
>>>>>>> dev
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
<<<<<<< HEAD
    const { apiName, lambdaStyle, database, apiType } = model.api;
    imp.importsForStack(output);
    imp.importApiManager(output);
    if (apiType === cloud_api_constants_1.APITYPE.graphql) {
        imp.importForAppsyncConstruct(output);
    }
    if (lambdaStyle) {
        imp.importForLambdaConstruct(output);
    }
    if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
        imp.importForDynamodbConstruct(output);
    }
    if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
        imp.importForNeptuneConstruct(output);
    }
    if (database === cloud_api_constants_1.DATABASE.auroraDb) {
        imp.importForAuroraDbConstruct(output);
=======
    cdk.importsForStack(output);
    manager.importApiManager(output);
    if (apiType === constant_1.APITYPE.graphql) {
        ts.writeImports(`./${constant_1.CONSTRUCTS.appsync}`, [constant_1.CONSTRUCTS.appsync]);
    }
    else {
        ts.writeImports(`./${constant_1.CONSTRUCTS.apigateway}`, [constant_1.CONSTRUCTS.apigateway]);
    }
    ts.writeImports(`./${constant_1.CONSTRUCTS.lambda}`, [constant_1.CONSTRUCTS.lambda]);
    if (database === constant_1.DATABASE.dynamo) {
        cdk.importForDynamodbConstruct(output);
    }
    if (database === constant_1.DATABASE.neptune) {
        ts.writeImports(`./${constant_1.CONSTRUCTS.neptuneDb}`, [constant_1.CONSTRUCTS.neptuneDb]);
    }
    if (database === constant_1.DATABASE.aurora) {
        ts.writeImports(`./${constant_1.CONSTRUCTS.auroradb}`, [constant_1.CONSTRUCTS.auroradb]);
>>>>>>> dev
    }
    ts.writeLine();
    cdk.initializeStack(`${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}`, () => {
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
<<<<<<< HEAD
        if (database == cloud_api_constants_1.DATABASE.dynamoDb) {
            ts.writeVariableDeclaration({
                name: `${apiName}_table`,
                typeName: cloud_api_constants_1.CONSTRUCTS.dynamodb,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.dynamodb}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.dynamodb}")`);
                },
            }, "const");
            ts.writeLine();
            if (lambdaStyle) {
                ts.writeVariableDeclaration({
                    name: `${apiName}Lambda`,
                    typeName: cloud_api_constants_1.CONSTRUCTS.lambda,
                    initializer: () => {
                        ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
                        functions_1.lambdaPropsHandlerDynamodb(output, `${apiName}_table`);
                        ts.writeLine("})");
                    },
                }, "const");
                ts.writeLine();
                functions_1.LambdaAccessHandler(output, apiName, lambdaStyle, mutationsAndQueries);
                ts.writeLine();
            }
            if (apiType === cloud_api_constants_1.APITYPE.graphql) {
                ts.writeVariableDeclaration({
                    name: `${apiName}`,
                    typeName: cloud_api_constants_1.CONSTRUCTS.appsync,
                    initializer: () => {
                        ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
                        functions_1.propsHandlerForAppsyncConstructDynamodb(output, apiName, lambdaStyle, mutationsAndQueries);
                        ts.writeLine("})");
                    },
                }, "const");
=======
        if (database == constant_1.DATABASE.dynamo) {
            ts.writeLine(`const ${apiName}Lambda = new ${constant_1.CONSTRUCTS.lambda}(this,"${apiName}${constant_1.CONSTRUCTS.lambda}");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}_table = new ${constant_1.CONSTRUCTS.dynamodb}(this,"${apiName}${constant_1.CONSTRUCTS.dynamodb}",{`);
            functions_1.propsHandlerForDynamoDbConstruct(output, apiName, lambdaStyle, mutationsAndQueries);
            ts.writeLine("})");
            functions_1.lambdaEnvHandler(output, apiName, lambdaStyle, mutationsAndQueries);
            if (apiType === constant_1.APITYPE.graphql) {
                ts.writeLine(`const ${apiName} = new ${constant_1.CONSTRUCTS.appsync}(this,"${apiName}${constant_1.CONSTRUCTS.appsync}",{`);
                functions_1.propsHandlerForAppsyncConstructDynamodb(output, apiName, lambdaStyle, mutationsAndQueries);
                ts.writeLine("})");
>>>>>>> dev
            }
        }
<<<<<<< HEAD
<<<<<<< HEAD
        else if (database == constant_1.DATABASE.neptune) {
            ts.writeLine(`const ${apiName}_neptunedb = new ${constant_1.CONSTRUCTS.neptuneDb}(this,"VpcNeptuneConstruct");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}Lambda = new ${constant_1.CONSTRUCTS.lambda}(this,"${apiName}${constant_1.CONSTRUCTS.lambda}",{`);
            functions_1.lambdaConstructPropsHandlerNeptunedb(output, apiName);
            ts.writeLine("})");
            ts.writeLine();
            if (apiType === constant_1.APITYPE.graphql) {
                ts.writeLine(`const ${apiName} = new ${constant_1.CONSTRUCTS.appsync}(this,"${apiName}${constant_1.CONSTRUCTS.appsync}",{`);
                functions_1.propsHandlerForAppsyncConstructNeptunedb(output, apiName, lambdaStyle, mutationsAndQueries);
                ts.writeLine("})");
            }
=======
        if (database == cloud_api_constants_1.DATABASE.neptuneDb) {
            ts.writeVariableDeclaration({
                name: `${apiName}_neptunedb`,
                typeName: cloud_api_constants_1.CONSTRUCTS.neptuneDb,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.neptuneDb}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.neptuneDb}")`);
                }
            }, "const");
            ts.writeLine();
            ts.writeVariableDeclaration({
                name: `${apiName}Lambda`,
                typeName: cloud_api_constants_1.CONSTRUCTS.lambda,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
                    functions_1.lambdaConstructPropsHandlerNeptunedb(output, apiName);
                    ts.writeLine("})");
                },
            }, "const");
>>>>>>> 97ae2538fc56736641690bc8efe05574e6cc766c
            ts.writeLine();
            ts.writeVariableDeclaration({
=======
        if (database == cloud_api_constants_1.DATABASE.neptuneDb) {
            ts.writeVariableDeclaration({
                name: `${apiName}_neptunedb`,
                typeName: cloud_api_constants_1.CONSTRUCTS.neptuneDb,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.neptuneDb}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.neptuneDb}")`);
                }
            }, "const");
            ts.writeLine();
            ts.writeVariableDeclaration({
                name: `${apiName}Lambda`,
                typeName: cloud_api_constants_1.CONSTRUCTS.lambda,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
                    functions_1.lambdaConstructPropsHandlerNeptunedb(output, apiName);
                    ts.writeLine("})");
                },
            }, "const");
            ts.writeLine();
            ts.writeVariableDeclaration({
>>>>>>> 97ae2538fc56736641690bc8efe05574e6cc766c
                name: `${apiName}`,
                typeName: cloud_api_constants_1.CONSTRUCTS.appsync,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
                    functions_1.propsHandlerForAppsyncConstructNeptunedb(output, apiName, lambdaStyle, mutationsAndQueries);
                    ts.writeLine("})");
                },
            }, "const");
        }
<<<<<<< HEAD
<<<<<<< HEAD
        else if (database == constant_1.DATABASE.aurora) {
            ts.writeLine(`const ${apiName}_auroradb = new ${constant_1.CONSTRUCTS.auroradb}(this,"${constant_1.CONSTRUCTS.auroradb}");`);
            ts.writeLine();
            ts.writeLine(`const ${apiName}Lambda = new ${constant_1.CONSTRUCTS.lambda}(this,"${apiName}${constant_1.CONSTRUCTS.lambda}",{`);
            functions_1.lambdaConstructPropsHandlerAuroradb(output, apiName);
            ts.writeLine("})");
            ts.writeLine();
            if (apiType === constant_1.APITYPE.graphql) {
                ts.writeLine(`const ${apiName} = new ${constant_1.CONSTRUCTS.appsync}(this,"${apiName}${constant_1.CONSTRUCTS.appsync}",{`);
                functions_1.propsHandlerForAppsyncConstructNeptunedb(output, apiName, lambdaStyle, mutationsAndQueries);
                ts.writeLine("})");
            }
=======
        if (database == cloud_api_constants_1.DATABASE.auroraDb) {
            ts.writeVariableDeclaration({
                name: `${apiName}_auroradb`,
                typeName: cloud_api_constants_1.CONSTRUCTS.auroradb,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.auroradb}(this,"${cloud_api_constants_1.CONSTRUCTS.auroradb}");`);
=======
        if (database == cloud_api_constants_1.DATABASE.auroraDb) {
            ts.writeVariableDeclaration({
                name: `${apiName}_auroradb`,
                typeName: cloud_api_constants_1.CONSTRUCTS.auroradb,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.auroradb}(this,"${cloud_api_constants_1.CONSTRUCTS.auroradb}");`);
                },
            }, "const");
            ts.writeLine();
            ts.writeVariableDeclaration({
                name: `${apiName}Lambda`,
                typeName: cloud_api_constants_1.CONSTRUCTS.lambda,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
                    functions_1.lambdaConstructPropsHandlerAuroradb(output, apiName);
                    ts.writeLine("})");
>>>>>>> 97ae2538fc56736641690bc8efe05574e6cc766c
                },
            }, "const");
            ts.writeLine();
            ts.writeVariableDeclaration({
<<<<<<< HEAD
                name: `${apiName}Lambda`,
                typeName: cloud_api_constants_1.CONSTRUCTS.lambda,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}",{`);
                    functions_1.lambdaConstructPropsHandlerAuroradb(output, apiName);
                    ts.writeLine("})");
                },
            }, "const");
>>>>>>> 97ae2538fc56736641690bc8efe05574e6cc766c
            ts.writeLine();
            ts.writeVariableDeclaration({
=======
>>>>>>> 97ae2538fc56736641690bc8efe05574e6cc766c
                name: `${apiName}`,
                typeName: cloud_api_constants_1.CONSTRUCTS.appsync,
                initializer: () => {
                    ts.writeLine(`new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",{`);
                    functions_1.propsHandlerForAppsyncConstructNeptunedb(output, apiName, lambdaStyle, mutationsAndQueries);
                    ts.writeLine("})");
                },
            }, "const");
<<<<<<< HEAD
        }
        if (apiType === constant_1.APITYPE.rest) {
            ts.writeLine(`const ${apiName} = new ${constant_1.CONSTRUCTS.apigateway}(this,"${apiName}${constant_1.CONSTRUCTS.apigateway}",{`);
            functions_1.propsHandlerForApiGatewayConstruct(output, apiName);
            ts.writeLine("})");
=======
>>>>>>> 97ae2538fc56736641690bc8efe05574e6cc766c
        }
    }, output);
});
