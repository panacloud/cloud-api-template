import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export const neptunePropertiesInitializer = (
  output: TextWriter,
  apiName: string
) => {
  const ts = new TypeScriptWriter(output);
  ts.writeLine(`this.VPCRef = ${apiName}_vpc;`);
  ts.writeLine(`this.SGRef = ${apiName}_sg;`);
  ts.writeLine(
    `this.neptuneReaderEndpoint = ${apiName}_neptuneCluster.attrReadEndpoint`
  );
};
