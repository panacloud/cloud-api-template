"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTRUCTS = exports.APITYPE = exports.DATABASE = exports.LAMBDA = void 0;
var LAMBDA;
(function (LAMBDA) {
    LAMBDA["single"] = "Single";
    LAMBDA["multiple"] = "Multiple";
})(LAMBDA = exports.LAMBDA || (exports.LAMBDA = {}));
var DATABASE;
(function (DATABASE) {
    DATABASE["dynamoDb"] = "DynamoDB (NoSQL)";
    DATABASE["neptuneDb"] = "Neptune (Graph)";
    DATABASE["auroraDb"] = "Aurora Serverless (Relational)";
    DATABASE["document"] = "DocumentDB (NoSQL MongoDB)";
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
