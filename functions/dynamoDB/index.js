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
exports.DynamoDB = void 0;
var core_1 = require("@yellicode/core");
var typescript_1 = require("@yellicode/typescript");
var DynamoDB = /** @class */ (function (_super) {
    __extends(DynamoDB, _super);
    function DynamoDB() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DynamoDB.prototype.initializeDynamodb = function (name) {
        this.writeLineIndented("const table = new ddb.Table(this, \"" + name + "\", {\n        tableName: \"" + name + "\",\n        billingMode: ddb.BillingMode.PAY_PER_REQUEST,\n        partitionKey: {\n          name: \"id\",\n          type: ddb.AttributeType.STRING,\n        },\n      });");
    };
    DynamoDB.prototype.importDynamodb = function (output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("@aws-cdk/aws-dynamodb", "ddb");
    };
    DynamoDB.prototype.grantFullAccess = function (lambda) {
        this.writeLine("table.grantFullAccess(" + lambda + ");");
    };
    return DynamoDB;
}(core_1.CodeWriter));
exports.DynamoDB = DynamoDB;
