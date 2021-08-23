"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cdk = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const _ = require("lodash");
class Cdk extends core_1.CodeWriter {
    importsForStack(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
        ts.writeImports("constructs", ["Construct"]);
    }
    importForAppsyncConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${cloud_api_constants_1.CONSTRUCTS.appsync}`, [cloud_api_constants_1.CONSTRUCTS.appsync]);
    }
    importForDynamodbConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${cloud_api_constants_1.CONSTRUCTS.dynamodb}`, [cloud_api_constants_1.CONSTRUCTS.dynamodb]);
    }
    importForLambdaConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${cloud_api_constants_1.CONSTRUCTS.lambda}`, [cloud_api_constants_1.CONSTRUCTS.lambda]);
    }
    importForNeptuneConstruct(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(`../lib/${cloud_api_constants_1.CONSTRUCTS.neptuneDb}`, [cloud_api_constants_1.CONSTRUCTS.neptuneDb]);
    }
    initializeStack(name, contents, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        const classDefinition = {
            name: `${_.upperFirst(_.camelCase(name))}Stack`,
            extends: ["Stack"],
            export: true,
        };
        ts.writeClassBlock(classDefinition, () => {
            ts.writeLineIndented(` 
      constructor(scope: Construct, id: string, props?: StackProps) {
          super(scope, id, props);
      `);
            contents();
            ts.writeLineIndented(`}`);
        });
    }
    initializeConstruct(constructName, propsName = "StackProps", contents, output, constructProps, properties) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLine();
        if (constructProps) {
            ts.writeInterfaceBlock({
                name: propsName
            }, () => {
                constructProps === null || constructProps === void 0 ? void 0 : constructProps.forEach(({ name, type }) => {
                    ts.writeLine(`${name}: ${type}`);
                });
            });
            ts.writeLine();
        }
        const classDefinition = {
            name: `${_.upperFirst(_.camelCase(constructName))}`,
            extends: ["Construct"],
            export: true,
        };
        ts.writeClassBlock(classDefinition, () => {
            properties === null || properties === void 0 ? void 0 : properties.forEach(({ accessModifier, isReadonly, name, typeName }) => {
                ts.writeLineIndented(`${accessModifier}${isReadonly ? ` readonly ` : ""} ${name} : ${typeName}`);
            });
            ts.writeLineIndented(` 
      constructor(scope: Construct, id: string, props?: ${propsName}) {
          super(scope, id);
      `);
            contents();
            ts.writeLineIndented(`}`);
        });
    }
    nodeAddDependency(sourceName, valueName) {
        this.writeLine(`${sourceName}.node.addDependency(${valueName});`);
    }
    tagAdd(source, name, value) {
        this.writeLine(`Tags.of(${source}).add("${name}", "${value}");`);
    }
    initializeTest(description, contents, output, workingDir) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLineIndented(`test("${description}", () => {`);
        ts.writeLine(`const app = new cdk.App()`);
        ts.writeLine(`const stack = new ${workingDir}.${_.upperFirst(_.camelCase(workingDir))}Stack(app, "MyTestStack");`);
        ts.writeLine(`const actual = app.synth().getStackArtifact(stack.artifactId).template;`);
        ts.writeLine();
        contents();
        ts.writeLineIndented(`})`);
    }
    initializeTest2(description, contents, output, constructor) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLineIndented(`test("${description}", () => {`);
        ts.writeLine(`const stack = new cdk.Stack();`);
        ts.writeLine(`const ${constructor} = new ${constructor}(stack, "neptuneTestStack");`);
        ts.writeLine();
        contents();
        ts.writeLineIndented(`})`);
    }
    ImportsForTest(output, workingDir) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", "cdk");
        ts.writeImports("@aws-cdk/assert", [
            "countResources",
            "haveResource",
            "expect",
            "countResourcesLike",
        ]);
        ts.writeImports(`../lib/${workingDir}-stack`, workingDir);
    }
    ImportsForTest2(output, workingDir) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", "cdk");
        ts.writeLine(`import "@aws-cdk/assert/jest"`);
    }
}
exports.Cdk = Cdk;
