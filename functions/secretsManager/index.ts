import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Iam extends CodeWriter {
  public importSecretsManager(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_secretsmanager as sm"]);
  }

  public attachLambdaPolicyToRole(secretName: string) {
    this.writeLine(
      `sm.Secret.fromSecretAttributes(this, "${secretName}", { secretArn: ${secretName} }).secretValue`
    );
  }
}
