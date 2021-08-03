"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE = exports.LAMBDA = void 0;
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
