"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cdk = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const _ = require("lodash");
class Cdk extends core_1.CodeWriter {
    importsForStack(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
        ts.writeImports("constructs", ["Construct"]);
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
                constructProps === null || constructProps === void 0 ? void 0 : constructProps.forEach((prop) => {
                    ts.writeLine(`${prop.name}: ${prop.type}`);
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
                ts.writeLineIndented(`${accessModifier}${isReadonly ? `readonly ` : ""} ${name} : ${typeName}`);
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
}
exports.Cdk = Cdk;
