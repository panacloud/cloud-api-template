import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class SecretsManager extends CodeWriter {
  public importSecretsManager(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_secretsmanager as sm"]);
  }

  public fromSecretAttributes(secretName: string) {
    this.writeLine(
      `sm.Secret.fromSecretAttributes(this, "${secretName}", { secretArn: ${secretName} }).secretValue`
    );
  }
}
