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
exports.BasicClass = void 0;
var core_1 = require("@yellicode/core");
var typescript_1 = require("@yellicode/typescript");
var BasicClass = /** @class */ (function (_super) {
    __extends(BasicClass, _super);
    function BasicClass() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BasicClass.prototype.initializeClass = function (name, contents, output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        var classDefinition = {
            name: name,
            "extends": ["cdk.Stack"],
            "export": true
        };
        ts.writeClassBlock(classDefinition, function () {
            ts.writeLineIndented(" \n      constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {\n          super(scope, id, props);\n      ");
            contents();
            ts.writeLineIndented("}");
        });
    };
    return BasicClass;
}(core_1.CodeWriter));
exports.BasicClass = BasicClass;
