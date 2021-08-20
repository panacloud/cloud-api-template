"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var core_1 = require("@yellicode/core");
var typescript_1 = require("@yellicode/typescript");
var cloud_api_constants_1 = require("../../cloud-api-constants");
var _ = require("lodash");
var Cdk = /** @class */ (function (_super) {
    __extends(Cdk, _super);
    function Cdk() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cdk.prototype.importsForStack = function (output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
        ts.writeImports("constructs", ["Construct"]);
    };
    Cdk.prototype.importForAppsyncConstruct = function (output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("../lib/" + cloud_api_constants_1.CONSTRUCTS.appsync, [cloud_api_constants_1.CONSTRUCTS.appsync]);
    };
    Cdk.prototype.importForDynamodbConstruct = function (output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("../lib/" + cloud_api_constants_1.CONSTRUCTS.dynamodb, [cloud_api_constants_1.CONSTRUCTS.dynamodb]);
    };
    Cdk.prototype.importForLambdaConstruct = function (output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("../lib/" + cloud_api_constants_1.CONSTRUCTS.lambda, [cloud_api_constants_1.CONSTRUCTS.lambda]);
    };
    Cdk.prototype.initializeStack = function (name, contents, output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        var classDefinition = {
            name: _.upperFirst(_.camelCase(name)) + "Stack",
            "extends": ["Stack"],
            "export": true
        };
        ts.writeClassBlock(classDefinition, function () {
            ts.writeLineIndented(" \n      constructor(scope: Construct, id: string, props?: StackProps) {\n          super(scope, id, props);\n      ");
            contents();
            ts.writeLineIndented("}");
        });
    };
    Cdk.prototype.initializeConstruct = function (constructName, propsName, contents, output, constructProps, properties) {
        if (propsName === void 0) { propsName = "StackProps"; }
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLine();
        if (constructProps) {
            ts.writeInterfaceBlock({
                name: propsName
            }, function () {
                constructProps === null || constructProps === void 0 ? void 0 : constructProps.forEach(function (_a) {
                    var name = _a.name, type = _a.type;
                    ts.writeLine(name + ": " + type);
                });
            });
            ts.writeLine();
        }
        var classDefinition = {
            name: "" + _.upperFirst(_.camelCase(constructName)),
            "extends": ["Construct"],
            "export": true
        };
        ts.writeClassBlock(classDefinition, function () {
            properties === null || properties === void 0 ? void 0 : properties.forEach(function (_a) {
                var accessModifier = _a.accessModifier, isReadonly = _a.isReadonly, name = _a.name, typeName = _a.typeName;
                ts.writeLineIndented("" + accessModifier + (isReadonly ? " readonly " : "") + " " + name + " : " + typeName);
            });
            ts.writeLineIndented(" \n      constructor(scope: Construct, id: string, props?: " + propsName + ") {\n          super(scope, id);\n      ");
            contents();
            ts.writeLineIndented("}");
        });
    };
    Cdk.prototype.nodeAddDependency = function (sourceName, valueName) {
        this.writeLine(sourceName + ".node.addDependency(" + valueName + ");");
    };
    Cdk.prototype.tagAdd = function (source, name, value) {
        this.writeLine("Tags.of(" + source + ").add(\"" + name + "\", \"" + value + "\");");
    };
    Cdk.prototype.initializeTest = function (description, contents, output, workingDir) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLineIndented("test(\"" + description + "\", () => {");
        ts.writeLine("const app = new cdk.App()");
        ts.writeLine("const stack = new " + workingDir + "." + _.upperFirst(_.camelCase(workingDir)) + "Stack(app, \"MyTestStack\");");
        ts.writeLine("const actual = app.synth().getStackArtifact(stack.artifactId).template;");
        ts.writeLine();
        contents();
<<<<<<< HEAD
        ts.writeLineIndented("})");
    };
    Cdk.prototype.initializeTest2 = function (description, contents, output, workingDir) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLineIndented("test(\"" + description + "\", () => {");
        ts.writeLine("const stack = new Stack();");
        ts.writeLine("const neptune = new " + workingDir + "." + _.upperFirst(_.camelCase(workingDir)) + "Stack(stack, \"MyTestStack\");");
        ts.writeLine();
        contents();
        ts.writeLineIndented("})");
    };
    Cdk.prototype.ImportsForTest = function (output, workingDir) {
        var ts = new typescript_1.TypeScriptWriter(output);
=======
        ts.writeLineIndented(`})`);
    }
    initializeTest2(description, contents, output, workingDir) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLineIndented(`test("${description}", () => {`);
        ts.writeLine(`const stack = new Stack();`);
        ts.writeLine(`const neptune = new ${workingDir}.${_.upperFirst(_.camelCase(workingDir))}Stack(stack, "MyTestStack");`);
        ts.writeLine();
        contents();
        ts.writeLineIndented(`})`);
    }
    ImportsForTest(output, workingDir) {
        const ts = new typescript_1.TypeScriptWriter(output);
>>>>>>> 2fbb6ecf0cc95dc9963e0c07b8fbd2a14beea399
        ts.writeImports("aws-cdk-lib", "cdk");
        ts.writeImports("@aws-cdk/assert", [
            "countResources",
            "haveResource",
            "expect",
            "countResourcesLike",
        ]);
<<<<<<< HEAD
        ts.writeImports("../lib/" + workingDir + "-stack", workingDir);
    };
    Cdk.prototype.ImportsForTest2 = function (output, workingDir) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", "cdk");
        ts.writeImports("@aws-cdk/assert/jest");
        ts.writeImports("../lib/" + workingDir + "-stack", workingDir);
    };
    return Cdk;
}(core_1.CodeWriter));
=======
        ts.writeImports(`../lib/${workingDir}-stack`, workingDir);
    }
    ImportsForTest2(output, workingDir) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", "cdk");
        ts.writeImports("@aws-cdk/assert/jest");
        ts.writeImports(`../lib/${workingDir}-stack`, workingDir);
    }
}
>>>>>>> 2fbb6ecf0cc95dc9963e0c07b8fbd2a14beea399
exports.Cdk = Cdk;
