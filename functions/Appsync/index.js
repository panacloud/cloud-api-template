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
exports.Appsync = void 0;
var core_1 = require("@yellicode/core");
var typescript_1 = require("@yellicode/typescript");
var Appsync = /** @class */ (function (_super) {
    __extends(Appsync, _super);
    function Appsync() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Appsync.prototype.initializeAppsync = function (name) {
        this
            .writeLineIndented(" const api = new appsync.GraphqlApi(this, \"" + name + "\", {\n            name: \"" + name + "\",\n            schema: appsync.Schema.fromAsset(\"graphql/schema.graphql\"),\n            authorizationConfig: {\n              defaultAuthorization: {\n                authorizationType: appsync.AuthorizationType.API_KEY,\n              },\n            },\n            xrayEnabled: true,\n          });");
    };
    Appsync.prototype.importAppsync = function (output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("@aws-cdk/aws-appsync", "appsync");
    };
    Appsync.prototype.lambdaDataSource = function (name, lambda) {
        this.writeLine("const lambdaDs = api.addLambdaDataSource(\"" + name + "\", " + lambda + ")");
    };
    Appsync.prototype.lambdaDataSourceResolverQuery = function (value) {
        this.writeLineIndented(" lambdaDs.createResolver({\n      typeName: \"Query\",\n      fieldName: \"" + value + "\",\n    });");
    };
    Appsync.prototype.lambdaDataSourceResolverMutation = function (value) {
        this.writeLineIndented(" lambdaDs.createResolver({\n      typeName: \"Mutation\",\n      fieldName: \"" + value + "\",\n    });");
    };
    return Appsync;
}(core_1.CodeWriter));
exports.Appsync = Appsync;
