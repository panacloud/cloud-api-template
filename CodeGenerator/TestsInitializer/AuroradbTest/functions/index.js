"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subnetAuroraFunction = void 0;
const typescript_1 = require("@yellicode/typescript");
const subnetAuroraFunction = (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`const subnetRefArray = [];`);
    ts.writeLine(`for (let subnet of private_subnets) {`);
    ts.writeLine(`subnetRefArray.push({`);
    ts.writeLine(`Ref: stack.getLogicalId(subnet.node.defaultChild as cdk.CfnElement),`);
    ts.writeLine(`});`);
    ts.writeLine(`};`);
};
exports.subnetAuroraFunction = subnetAuroraFunction;
