import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class apiManager extends CodeWriter {
  public importApiManager(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("panacloud-manager", ["PanacloudManager"]);
  }

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
