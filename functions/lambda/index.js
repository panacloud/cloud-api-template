"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Lambda = void 0;
var core_1 = require("@yellicode/core");
var typescript_1 = require("@yellicode/typescript");
var Lambda = /** @class */ (function (_super) {
    __extends(Lambda, _super);
    function Lambda() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lambda.prototype.initializeLambda = function (name) {
        this
            .writeLineIndented(" const lambdaFn = new lambda.Function(this, \"" + name + "\", {\n        functionName: \"" + name + "\",\n        runtime: lambda.Runtime.NODEJS_12_X,\n        handler: \"main.handler\",\n        code: lambda.Code.fromAsset(\"lambda-fns\"),\n        memorySize: 1024,\n      });");
    };
    Lambda.prototype.importLambda = function (output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("@aws-cdk/aws-lambda", "lambda");
    };
    Lambda.prototype.addEnvironment = function (name, value) {
        this.writeLine("lambdaFn.addEnvironment(\"" + name + "\", " + value + ");");
    };
    return Lambda;
}(core_1.CodeWriter));
exports.Lambda = Lambda;
