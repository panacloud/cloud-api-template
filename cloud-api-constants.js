"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTRUCTS = exports.DATABASE = exports.LAMBDA = void 0;
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
})(CONSTRUCTS = exports.CONSTRUCTS || (exports.CONSTRUCTS = {}));
