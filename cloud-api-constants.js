"use strict";
exports.__esModule = true;
var LAMBDA;
(function (LAMBDA) {
    LAMBDA["single"] = "SINGLE";
    LAMBDA["multiple"] = "MULTIPLE";
})(LAMBDA = exports.LAMBDA || (exports.LAMBDA = {}));
var DATABASE;
(function (DATABASE) {
    DATABASE["dynamoDb"] = "DYNAMODB";
    DATABASE["auroraDb"] = "AURORASERVERLESS";
    DATABASE["neptuneDb"] = "NEPTUNE";
})(DATABASE = exports.DATABASE || (exports.DATABASE = {}));
var CONSTRUCTS;
(function (CONSTRUCTS) {
    CONSTRUCTS["appsync"] = "AppsyncConstruct";
    CONSTRUCTS["dynamodb"] = "DynamodbConstruct";
    CONSTRUCTS["lambda"] = "LambdaConstruct";
    CONSTRUCTS["neptuneDb"] = "VpcNeptuneConstruct";
    CONSTRUCTS["auroradb"] = "AuroraDbConstruct";
})(CONSTRUCTS = exports.CONSTRUCTS || (exports.CONSTRUCTS = {}));
