"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTRUCTS = exports.APITYPE = exports.DATABASE = exports.LAMBDA = void 0;
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
var APITYPE;
(function (APITYPE) {
    APITYPE["graphql"] = "GRAPHQL API";
    APITYPE["rest"] = "REST API";
})(APITYPE = exports.APITYPE || (exports.APITYPE = {}));
var CONSTRUCTS;
(function (CONSTRUCTS) {
    CONSTRUCTS["appsync"] = "AppsyncConstruct";
    CONSTRUCTS["dynamodb"] = "DynamodbConstruct";
    CONSTRUCTS["lambda"] = "LambdaConstruct";
    CONSTRUCTS["neptuneDb"] = "VpcNeptuneConstruct";
    CONSTRUCTS["auroradb"] = "AuroraDbConstruct";
    CONSTRUCTS["apigateway"] = "ApiGatewayConstruct";
})(CONSTRUCTS = exports.CONSTRUCTS || (exports.CONSTRUCTS = {}));
