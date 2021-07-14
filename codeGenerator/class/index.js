"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const api_manager_1 = require("../../functions/api-manager");
const Appsync_1 = require("../../functions/Appsync");
const dynamoDB_1 = require("../../functions/dynamoDB");
const lambda_1 = require("../../functions/lambda");
const class_1 = require("../../functions/utils/class");
const model = require('../../model.json');
const { USER_WORKING_DIRECTORY } = model;
const { API_NAME } = model;
templating_1.Generator.generateFromModel({ outputFile: `../../../${USER_WORKING_DIRECTORY}/lib/${USER_WORKING_DIRECTORY}-stack.ts` }, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const lambda = new lambda_1.Lambda(output);
    const db = new dynamoDB_1.DynamoDB(output);
    const appsync = new Appsync_1.Appsync(output);
    const manager = new api_manager_1.apiManager(output);
    const cls = new class_1.BasicClass(output);
    ts.writeImports("@aws-cdk/core", "cdk");
    appsync.importAppsync(output);
    manager.importApiManager(output);
    lambda.importLambda(output);
    db.importDynamodb(output);
    cls.initializeClass("PanacloudStack", () => {
        var _a, _b;
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        appsync.initializeAppsyncApi(API_NAME, output);
        ts.writeLine();
        lambda.initializeLambda(API_NAME, output);
        ts.writeLine();
        appsync.appsyncDataSource(output, API_NAME);
        ts.writeLine();
        for (var key in (_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
            appsync.lambdaDataSourceResolver(key, "Query", "todoApp");
        }
        ts.writeLine();
        for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Mutation) {
            appsync.lambdaDataSourceResolver(key, "Mutation", "todoApp");
        }
        ts.writeLine();
        db.initializeDynamodb("todoTable");
        ts.writeLine();
        db.grantFullAccess("lambdaFn");
        ts.writeLine();
        lambda.addEnvironment("TODOS_TABLE", "table.tableName");
        ts.writeLine();
    }, output);
});
