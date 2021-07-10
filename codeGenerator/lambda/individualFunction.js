"use strict";
exports.__esModule = true;
var templating_1 = require("@yellicode/templating");
var lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
var path = require('path');
var USER_WORKING_DIRECTORY = require('../../model.json').USER_WORKING_DIRECTORY;
var jsonObj = require("../../model.json");
var generatePath = path.relative(path.resolve('.'), "/" + USER_WORKING_DIRECTORY);
Object.keys(jsonObj.type.Query).forEach(function (key) {
    templating_1.Generator.generate({ outputFile: generatePath + "/lambda-fns/" + key + ".ts" }, function (writer) {
        var lambda = new lambdaFunction_1.LambdaFunction(writer);
        lambda.helloWorldFunction(key);
        console.log("USER_WORKING_DIRECTORY  1===>", USER_WORKING_DIRECTORY);
    });
});
Object.keys(jsonObj.type.Mutation).forEach(function (key) {
    templating_1.Generator.generate({ outputFile: USER_WORKING_DIRECTORY + "/lambda-fns/" + key + ".ts" }, function (writer) {
        var lambda = new lambdaFunction_1.LambdaFunction(writer);
        lambda.helloWorldFunction(key);
    });
});
