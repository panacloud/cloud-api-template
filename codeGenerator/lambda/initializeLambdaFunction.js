"use strict";
exports.__esModule = true;
var templating_1 = require("@yellicode/templating");
var typescript_1 = require("@yellicode/typescript");
var lambdaFunction_1 = require("../../functions/lambda/lambdaFunction");
var path = require('path');
var USER_WORKING_DIRECTORY = require('../../model.json').USER_WORKING_DIRECTORY;
var generatePath = path.relative(path.resolve('.'), "/" + USER_WORKING_DIRECTORY);
templating_1.Generator.generateFromModel({ outputFile: generatePath + "/lambda-fns/main.ts" }, function (output, model) {
    var ts = new typescript_1.TypeScriptWriter(output);
    var lambda = new lambdaFunction_1.LambdaFunction(output);
    console.log("USER_WORKING_DIRECTORY  2===>", USER_WORKING_DIRECTORY);
    for (var key in model.type.Query) {
        lambda.importIndividualFunction(output, key, "./" + key);
    }
    for (var key in model.type.Mutation) {
        lambda.importIndividualFunction(output, key, "./" + key);
    }
    ts.writeLine();
    ts.writeLineIndented("\n    type Event = {\n        info: {\n          fieldName: string\n       }\n     }");
    ts.writeLine();
    lambda.initializeLambdaFunction(function () {
        for (var key in model.type.Query) {
            ts.writeLineIndented("\n          case \"" + key + "\":\n              return await " + key + "();\n          ");
        }
        for (var key in model.type.Mutation) {
            ts.writeLineIndented("\n          case \"" + key + "\":\n              return await " + key + "();\n          ");
        }
    }, output);
});
