"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaWithAuroraFunction = exports.lambdaWithNeptuneFunction = void 0;
const typescript_1 = require("@yellicode/typescript");
const lambdaWithNeptuneFunction = (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`);
    ts.writeLine();
    ts.writeLine(`const LambdaConstruct_stack = new LambdaConstruct(stack, 'LambdaConstructTest', {`);
    ts.writeLine(`VPCRef: VpcNeptuneConstruct_stack.VPCRef,`);
    ts.writeLine(`SGRef: VpcNeptuneConstruct_stack.SGRef,`);
    ts.writeLine(`neptuneReaderEndpoint: VpcNeptuneConstruct_stack.neptuneReaderEndpoint,`);
    ts.writeLine(`});`);
    ts.writeLine();
    ts.writeLine(`const cfn_cluster = VpcNeptuneConstruct_stack.node.children.filter(`);
    ts.writeLine(`(elem) => elem instanceof cdk.aws_neptune.CfnDBCluster`);
    ts.writeLine(`);`);
};
exports.lambdaWithNeptuneFunction = lambdaWithNeptuneFunction;
const lambdaWithAuroraFunction = (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`const LambdaConstruct_stack = new LambdaConstruct(stack, 'LambdaConstructTest', {`);
    ts.writeLine(`vpcRef: AuroraDbConstruct_stack.vpcRef,`);
    ts.writeLine(`secretRef: AuroraDbConstruct_stack.secretRef,`);
    ts.writeLine(`serviceRole: AuroraDbConstruct_stack.serviceRole,`);
    ts.writeLine(`});`);
};
exports.lambdaWithAuroraFunction = lambdaWithAuroraFunction;
