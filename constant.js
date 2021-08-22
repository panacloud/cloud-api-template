"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTRUCTS = exports.PATH = exports.SAASTYPE = exports.DATABASE = exports.LAMBDASTYLE = exports.APITYPE = void 0;
var APITYPE;
(function (APITYPE) {
    APITYPE["graphql"] = "GraphQL";
    APITYPE["rest"] = "REST OpenAPI";
})(APITYPE = exports.APITYPE || (exports.APITYPE = {}));
var LAMBDASTYLE;
(function (LAMBDASTYLE) {
    LAMBDASTYLE["single"] = "Single";
    LAMBDASTYLE["multi"] = "Multiple";
})(LAMBDASTYLE = exports.LAMBDASTYLE || (exports.LAMBDASTYLE = {}));
var DATABASE;
(function (DATABASE) {
    DATABASE["dynamo"] = "DynamoDB (NoSQL)";
    DATABASE["neptune"] = "Neptune (Graph)";
    DATABASE["aurora"] = "Aurora Serverless (Relational)";
    DATABASE["document"] = "DocumentDB (NoSQL MongoDB)";
})(DATABASE = exports.DATABASE || (exports.DATABASE = {}));
var SAASTYPE;
(function (SAASTYPE) {
    SAASTYPE["app"] = "App";
    SAASTYPE["api"] = "API";
})(SAASTYPE = exports.SAASTYPE || (exports.SAASTYPE = {}));
var PATH;
(function (PATH) {
    PATH["bin"] = "../../../bin/";
    PATH["lib"] = "../../../lib/";
    PATH["lambda"] = "../../../lambda-fns/";
    PATH["test"] = "../../../../test/";
})(PATH = exports.PATH || (exports.PATH = {}));
var CONSTRUCTS;
(function (CONSTRUCTS) {
    CONSTRUCTS["appsync"] = "AppsyncConstruct";
    CONSTRUCTS["dynamodb"] = "DynamodbConstruct";
    CONSTRUCTS["lambda"] = "LambdaConstruct";
    CONSTRUCTS["neptuneDb"] = "VpcNeptuneConstruct";
    CONSTRUCTS["auroradb"] = "AuroraDbConstruct";
    CONSTRUCTS["apigateway"] = "ApiGatewayConstruct";
})(CONSTRUCTS = exports.CONSTRUCTS || (exports.CONSTRUCTS = {}));
