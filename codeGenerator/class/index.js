"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Appsync_1 = require("../../functions/Appsync");
const dynamoDB_1 = require("../../functions/dynamoDB");
const lambda_1 = require("../../functions/lambda");
const class_1 = require("../../functions/utils/class");
const model = require('../../model.json');
const { USER_WORKING_DIRECTORY } = model;
templating_1.Generator.generateFromModel({ outputFile: `../../../${USER_WORKING_DIRECTORY}/lib/${USER_WORKING_DIRECTORY}-stack.ts` }, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const lambda = new lambda_1.Lambda(output);
    const db = new dynamoDB_1.DynamoDB(output);
    const appsync = new Appsync_1.Appsync(output);
    const cls = new class_1.BasicClass(output);
    ts.writeImports("@aws-cdk/core", "cdk");
    appsync.importAppsync(output);
    lambda.importLambda(output);
    db.importDynamodb(output);
    cls.initializeClass("PanacloudStack", () => {
        var _a, _b;
        appsync.initializeAppsync("api");
        ts.writeLine();
        lambda.initializeLambda("todoLambda");
        ts.writeLine();
        appsync.lambdaDataSource("lambdaDs", "lambdaFn");
        ts.writeLine();
        for (var key in (_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
            appsync.lambdaDataSourceResolverQuery(key);
        }
        ts.writeLine();
        for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Mutation) {
            appsync.lambdaDataSourceResolverMutation(key);
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
