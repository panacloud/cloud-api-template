import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export const subnetAuroraFunction = (output: TextWriter) => {
  const ts = new TypeScriptWriter(output);
  ts.writeLine(`const subnetRefArray = [];`);
  ts.writeLine(`for (let subnet of private_subnets) {`);
  ts.writeLine(`subnetRefArray.push({`);
  ts.writeLine(
    `Ref: stack.getLogicalId(subnet.node.defaultChild as cdk.CfnElement),`
  );
  ts.writeLine(`});`);
  ts.writeLine(`};`);
};
