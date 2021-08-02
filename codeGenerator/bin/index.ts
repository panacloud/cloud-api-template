import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const _ = require("lodash")

Generator.generate(
    {
      outputFile: `../../../../bin/${USER_WORKING_DIRECTORY}.ts`,
    },
    (output: TextWriter) => {
        const ts = new TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", "cdk");
        ts.writeImports(`../lib/${USER_WORKING_DIRECTORY}-stack`, [`${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}Stack`])

        ts.writeVariableDeclaration(
            {
              name: `app`,
              typeName: "cdk.App",
              initializer: () => {
                ts.writeLine(`new cdk.App()`);
              },
            },
            "const"
        );

        output.writeLineIndented(`new ${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}Stack(app, "${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}Stack", {});`)
})