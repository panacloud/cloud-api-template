import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export const subnetFunction = (output: TextWriter) => {
    const ts = new TypeScriptWriter(output)
    ts.writeLine(`const subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`);
    ts.writeLine(`const subnetRefArray = [];`);
    ts.writeLine(`for (let subnet of subnets) {`);
    ts.writeLine(`subnetRefArray.push({`);
    ts.writeLine(
      `Ref: stack.getLogicalId(subnet.node.defaultChild as cdk.CfnElement),`
    );
    ts.writeLine(`});`);
    ts.writeLine(`}`);
}

export const isolatedFunction = (output: TextWriter) => {
    const ts = new TypeScriptWriter(output)
    ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`);
    ts.writeLine(`const isolatedRouteTables = [`);
    ts.writeLine(`isolated_subnets[0].routeTable,`);
    ts.writeLine(`isolated_subnets[1].routeTable,`);
    ts.writeLine(`]`)
}