"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestingConstructs = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const _ = require("lodash");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
class TestingConstructs extends core_1.CodeWriter {
    initializeTest(description, contents, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeLineIndented(`test("${description}", () => {`);
        ts.writeLine(`const app = new cdk.App()`);
        ts.writeLine(`const stack = new ${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}.${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}Stack(app, "MyTestStack");`);
        ts.writeLine(`const actual = app.synth().getStackArtifact(stack.artifactId).template;`);
        ts.writeLine();
        contents();
        ts.writeLineIndented(`})`);
    }
    ImportsForTest(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", "cdk");
        ts.writeImports("@aws-cdk/assert", ["countResources", "haveResource", "expect", "countResourcesLike"]);
        ts.writeImports(`../lib/${USER_WORKING_DIRECTORY}-stack`, "PanacloudApi");
    }
}
exports.TestingConstructs = TestingConstructs;
