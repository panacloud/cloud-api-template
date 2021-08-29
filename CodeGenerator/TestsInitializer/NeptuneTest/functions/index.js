"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isolatedFunction = exports.subnetFunction = void 0;
const typescript_1 = require("@yellicode/typescript");
const subnetFunction = (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`const subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`);
    ts.writeLine(`const subnetRefArray = [];`);
    ts.writeLine(`for (let subnet of subnets) {`);
    ts.writeLine(`subnetRefArray.push({`);
    ts.writeLine(`Ref: stack.getLogicalId(subnet.node.defaultChild as cdk.CfnElement),`);
    ts.writeLine(`});`);
    ts.writeLine(`}`);
};
exports.subnetFunction = subnetFunction;
const isolatedFunction = (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`);
    ts.writeLine(`const isolatedRouteTables = [`);
    ts.writeLine(`isolated_subnets[0].routeTable,`);
    ts.writeLine(`isolated_subnets[1].routeTable,`);
    ts.writeLine(`]`);
};
exports.isolatedFunction = isolatedFunction;
