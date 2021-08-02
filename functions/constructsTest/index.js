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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBQ3pELE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUMxQyxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFFekMsTUFBYSxpQkFBa0IsU0FBUSxpQkFBVTtJQUN4QyxjQUFjLENBQUMsV0FBbUIsRUFBRSxRQUFhLEVBQUUsTUFBa0I7UUFDMUUsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxXQUFXLFlBQVksQ0FBQyxDQUFDO1FBQ3ZELEVBQUUsQ0FBQyxTQUFTLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtRQUN6QyxFQUFFLENBQUMsU0FBUyxDQUFDLHFCQUFxQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDLDRCQUE0QixDQUFDLENBQUE7UUFDckssRUFBRSxDQUFDLFNBQVMsQ0FBQyx5RUFBeUUsQ0FBQyxDQUFBO1FBQ3ZGLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtRQUNkLFFBQVEsRUFBRSxDQUFDO1FBQ1gsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFDTSxjQUFjLENBQUMsTUFBaUI7UUFDckMsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxFQUFFLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBQyxLQUFLLENBQUMsQ0FBQTtRQUNwQyxFQUFFLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFDLENBQUMsZ0JBQWdCLEVBQUMsY0FBYyxFQUFDLFFBQVEsRUFBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUE7UUFDbEcsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLHNCQUFzQixRQUFRLEVBQUMsY0FBYyxDQUFDLENBQUE7SUFDMUUsQ0FBQztDQUNGO0FBakJELDhDQWlCQyJ9