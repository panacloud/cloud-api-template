import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
const _ = require("lodash");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;


export class TestingConstructs extends CodeWriter {
  public initializeTest(description: string, contents: any, output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeLineIndented(`test("${description}", () => {`);
    ts.writeLine(`const app = new cdk.App()`)
    ts.writeLine(`const stack = new ${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}.${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}Stack(app, "MyTestStack");`)
    ts.writeLine(`const actual = app.synth().getStackArtifact(stack.artifactId).template;`)
    ts.writeLine()
    contents();
    ts.writeLineIndented(`})`);
  }
  public ImportsForTest(output:TextWriter){
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib","cdk")
    ts.writeImports("@aws-cdk/assert",["countResources","haveResource","expect","countResourcesLike"])
    ts.writeImports(`../lib/${USER_WORKING_DIRECTORY}-stack`,"PanacloudApi")
  }
}
