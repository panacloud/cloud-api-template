import { CodeWriter } from "@yellicode/core";

export class Cdk extends CodeWriter {
  public importIam(source: string, name: string, value: string) {
    this.writeLine(`cdk.Tags.of(${source}).add("${name}", "${value}");`);
  }
}
