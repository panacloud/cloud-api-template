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
const { USER_WORKING_DIRECTORY, API_NAME, LAMBDA_STYLE } = model;
const fs = require("fs");
templating_1.Generator.generateFromModel({
    outputFile: `../../../lib/${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const lambda = new lambda_1.Lambda(output);
    const db = new dynamoDB_1.DynamoDB(output);
    const appsync = new Appsync_1.Appsync(output);
    const iam = new iam_1.Iam(output);
    const manager = new api_manager_1.apiManager(output);
    const cls = new class_1.BasicClass(output);
    const schema = fs
        .readFileSync(`../../../graphql/schema.graphql`)
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
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        // console.log(mutationsAndQueries);
        if (LAMBDA_STYLE === "single lambda") {
            lambda.initializeLambda(API_NAME, output, LAMBDA_STYLE);
        }
        else if (LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                lambda.initializeLambda(API_NAME, output, LAMBDA_STYLE, key);
                ts.writeLine();
            });
        }
        if (LAMBDA_STYLE === "single lambda") {
            appsync.appsyncDataSource(output, API_NAME, API_NAME, LAMBDA_STYLE);
        }
        else if (LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                appsync.appsyncDataSource(output, API_NAME, API_NAME, LAMBDA_STYLE, key);
                ts.writeLine();
            });
        }
        db.initializeDynamodb(API_NAME, output);
        ts.writeLine();
        if (LAMBDA_STYLE === "single lambda") {
            db.grantFullAccess(`${API_NAME}`, `${API_NAME}_table`, LAMBDA_STYLE);
        }
        else if (LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                db.grantFullAccess(`${API_NAME}`, `${API_NAME}_table`, LAMBDA_STYLE, key);
                ts.writeLine();
            });
        }
        if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
            for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
                if (LAMBDA_STYLE === "single lambda") {
                    appsync.lambdaDataSourceResolver(key, "Query", `ds_${API_NAME}`);
                }
                else if (LAMBDA_STYLE === "multiple lambda") {
                    appsync.lambdaDataSourceResolver(key, "Query", `ds_${API_NAME}_${key}`);
                }
            }
            ts.writeLine();
        }
        if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
            for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
                if (LAMBDA_STYLE === "single lambda") {
                    appsync.lambdaDataSourceResolver(key, "Mutation", `ds_${API_NAME}`);
                }
                else if (LAMBDA_STYLE === "multiple lambda") {
                    appsync.lambdaDataSourceResolver(key, "Mutation", `ds_${API_NAME}_${key}`);
                }
            }
            ts.writeLine();
        }
        if (LAMBDA_STYLE === "single lambda") {
            lambda.addEnvironment(`${API_NAME}`, `${API_NAME}_TABLE`, `${API_NAME}_table.tableName`, LAMBDA_STYLE);
        }
        else if (LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                lambda.addEnvironment(`${API_NAME}`, `${API_NAME}_TABLE`, `${API_NAME}_table.tableName`, LAMBDA_STYLE, `${key}`);
                ts.writeLine();
            });
        }
    }, output);
});
