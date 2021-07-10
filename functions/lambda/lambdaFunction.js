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
exports.LambdaFunction = void 0;
var core_1 = require("@yellicode/core");
var typescript_1 = require("@yellicode/typescript");
var LambdaFunction = /** @class */ (function (_super) {
    __extends(LambdaFunction, _super);
    function LambdaFunction() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LambdaFunction.prototype.initializeLambdaFunction = function (content, output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLine("exports.handler = async (event:Event) => {");
        ts.writeLine("switch (event.info.fieldName) {");
        ts.writeLine();
        content();
        ts.writeLine();
        ts.writeLine("}");
        ts.writeLine("}");
    };
    LambdaFunction.prototype.importIndividualFunction = function (output, name, path) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(path, [name]);
    };
    LambdaFunction.prototype.helloWorldFunction = function (name) {
        this.writeLineIndented("\n    const AWS = require('aws-sdk');\n    \n    export const " + name + " = async() => {\n      // write your code here\n    }\n    ");
    };
    return LambdaFunction;
}(core_1.CodeWriter));
exports.LambdaFunction = LambdaFunction;
