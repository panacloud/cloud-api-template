import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter, ClassDefinition } from "@yellicode/typescript";

export class BasicClass extends CodeWriter {
  public initializeClass(name: string, contents: any, output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    const classDefinition: ClassDefinition = {
      name: name,
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
}
