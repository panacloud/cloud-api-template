"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const _ = require("lodash");
templating_1.Generator.generateFromModel({
    outputFile: `../../../../bin/${USER_WORKING_DIRECTORY}.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", "* as cdk");
    ts.writeImports(`../lib/${USER_WORKING_DIRECTORY}-stack.ts`, [`${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}Stack`]);
    ts.writeVariableDeclaration({
        name: `app`,
        typeName: "cdk.App",
        initializer: () => {
            ts.writeLine(`new cdk.App()`);
        },
    }, "const");
    output.writeLineIndented(`new ${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}Stack(app, "${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}Stack", {});`);
});
