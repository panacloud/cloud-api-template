"use strict";
exports.__esModule = true;
var templating_1 = require("@yellicode/templating");
var typescript_1 = require("@yellicode/typescript");
var Appsync_1 = require("../../functions/Appsync");
var dynamoDB_1 = require("../../functions/dynamoDB");
var lambda_1 = require("../../functions/lambda");
var class_1 = require("../../functions/utils/class");
var USER_WORKING_DIRECTORY = require('../../model.json').USER_WORKING_DIRECTORY;
var path = require('path');
var generatePath = path.relative(path.resolve('.'), "/" + USER_WORKING_DIRECTORY);
templating_1.Generator.generateFromModel({ outputFile: generatePath + "/lib/" + USER_WORKING_DIRECTORY + "-stack.ts" }, function (output, model) {
    var ts = new typescript_1.TypeScriptWriter(output);
    var lambda = new lambda_1.Lambda(output);
    var db = new dynamoDB_1.DynamoDB(output);
    var appsync = new Appsync_1.Appsync(output);
    var cls = new class_1.BasicClass(output);
    ts.writeImports("@aws-cdk/core", "cdk");
    appsync.importAppsync(output);
    lambda.importLambda(output);
    db.importDynamodb(output);
    cls.initializeClass("PanacloudStack", function () {
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
