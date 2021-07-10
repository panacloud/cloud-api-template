"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicClass = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class BasicClass extends core_1.CodeWriter {
    initializeClass(name, contents, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        const classDefinition = {
            name: name,
            extends: ["cdk.Stack"],
            export: true,
        };
        ts.writeClassBlock(classDefinition, () => {
            ts.writeLineIndented(` 
      constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
          super(scope, id, props);
      `);
            contents();
            ts.writeLineIndented(`}`);
        });
    }
}
exports.BasicClass = BasicClass;
