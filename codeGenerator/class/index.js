"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const api_manager_1 = require("../../functions/api-manager");
const Appsync_1 = require("../../functions/Appsync");
const dynamoDB_1 = require("../../functions/dynamoDB");
const iam_1 = require("../../functions/iam");
const lambda_1 = require("../../functions/lambda");
const class_1 = require("../../functions/utils/class");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY, API_NAME } = model;
const fs = require("fs");
templating_1.Generator.generateFromModel({
    outputFile: `../../../${USER_WORKING_DIRECTORY}/lib/${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const lambda = new lambda_1.Lambda(output);
    const db = new dynamoDB_1.DynamoDB(output);
    const appsync = new Appsync_1.Appsync(output);
    const iam = new iam_1.Iam(output);
    const manager = new api_manager_1.apiManager(output);
    const cls = new class_1.BasicClass(output);
    const schema = fs
        .readFileSync(`../../../${USER_WORKING_DIRECTORY}/graphql/schema.graphql`)
        .toString("utf8");
    ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
    ts.writeImports("constructs", ["Construct"]);
    appsync.importAppsync(output);
    manager.importApiManager(output);
    lambda.importLambda(output);
    iam.importIam(output);
    db.importDynamodb(output);
    cls.initializeClass(`${USER_WORKING_DIRECTORY}`, () => {
        var _a, _b, _c, _d;
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        appsync.initializeAppsyncApi(API_NAME, output);
        ts.writeLine();
        appsync.initializeAppsyncSchema(schema, output);
        ts.writeLine();
        appsync.initializeApiKeyForAppsync(API_NAME);
        ts.writeLine();
        iam.serviceRoleForAppsync(output, API_NAME);
        ts.writeLine();
        iam.attachLambdaPolicyToRole(API_NAME);
        ts.writeLine();
        if (model.type.Mutation) {
            Object.keys(model.type.Mutation).forEach((key) => {
                lambda.initializeLambda(API_NAME, output, key);
                ts.writeLine();
            });
        }
        if (model.type.Query) {
            Object.keys(model.type.Query).forEach((key) => {
                lambda.initializeLambda(API_NAME, output, key);
                ts.writeLine();
            });
        }
        appsync.appsyncDataSource(output, API_NAME, API_NAME);
        ts.writeLine();
        db.initializeDynamodb(API_NAME, output);
        ts.writeLine();
        db.grantFullAccess(`${API_NAME}`, `${API_NAME}_table`);
        ts.writeLine();
        if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
            for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
                appsync.lambdaDataSourceResolver(key, "Query");
            }
            ts.writeLine();
        }
        if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
            for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
                appsync.lambdaDataSourceResolver(key, "Mutation");
            }
            ts.writeLine();
        }
        if (model.type.Mutation) {
            Object.keys(model.type.Mutation).forEach((key) => {
                lambda.addEnvironment(`${API_NAME}`, `${API_NAME}_TABLE`, `${API_NAME}_table.tableName`, `${key}`);
                ts.writeLine();
            });
        }
        if (model.type.Query) {
            Object.keys(model.type.Query).forEach((key) => {
                lambda.addEnvironment(`${API_NAME}`, `${API_NAME}_TABLE`, `${API_NAME}_table.tableName`, `${key}`);
                ts.writeLine();
            });
        }
    }, output);
});
