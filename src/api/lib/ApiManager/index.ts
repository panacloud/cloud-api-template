import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class apiManager extends CodeWriter {
  public apiManagerInitializer(output: TextWriter, name: string) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: "apiManager",
        typeName: "PanacloudManager",
        initializer: () => {
          ts.writeLine(`new PanacloudManager(this, "${name}APIManager")`);
        },
      },
      "const"
    );
  }
}
