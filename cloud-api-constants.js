"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTRUCTS = exports.SAASTYPE = exports.DATABASE = exports.LAMBDA = exports.APITYPE = void 0;
var APITYPE;
(function (APITYPE) {
    APITYPE["graphql"] = "GRAPHQL API";
    APITYPE["rest"] = "REST OpenAPI";
})(APITYPE = exports.APITYPE || (exports.APITYPE = {}));
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
var SAASTYPE;
(function (SAASTYPE) {
    SAASTYPE["app"] = "App";
    SAASTYPE["api"] = "API";
})(SAASTYPE = exports.SAASTYPE || (exports.SAASTYPE = {}));
var CONSTRUCTS;
(function (CONSTRUCTS) {
    CONSTRUCTS["appsync"] = "AppsyncConstruct";
    CONSTRUCTS["dynamodb"] = "DynamodbConstruct";
    CONSTRUCTS["lambda"] = "LambdaConstruct";
    CONSTRUCTS["neptuneDb"] = "VpcNeptuneConstruct";
    CONSTRUCTS["auroradb"] = "AuroraDbConstruct";
})(CONSTRUCTS = exports.CONSTRUCTS || (exports.CONSTRUCTS = {}));
