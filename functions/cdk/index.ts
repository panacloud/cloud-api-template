import { CodeWriter } from "@yellicode/core";

export class Cdk extends CodeWriter {
  public tagAdd(source: string, name: string, value: string) {
    this.writeLine(`Tags.of(${source}).add("${name}", "${value}");`);
  }
}
