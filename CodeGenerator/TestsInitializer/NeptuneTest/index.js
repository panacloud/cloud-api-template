"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Neptune_1 = require("../../../Constructs/Neptune");
// import { Iam } from '../../../Constructs/Iam';
const Cdk_1 = require("../../../Constructs/Cdk");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const { database } = model.api;
if (database && database === cloud_api_constants_1.DATABASE.neptuneDb) {
    templating_1.Generator.generateFromModel({
        outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-neptune.test.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const testClass = new Cdk_1.Cdk(output);
        const cdk = new Cdk_1.Cdk(output);
        const neptune = new Neptune_1.Neptune(output);
        const { apiName } = model.api;
        testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY);
        cdk.importForNeptuneConstruct(output);
        ts.writeLine();
        testClass.initializeTest2('Neptune Construct Tests', () => {
            ts.writeLine(`const constructs = VpcNeptuneConstruct.node.children;`);
            ts.writeLine(`expect(constructs).toHaveLength(5);`);
            ts.writeLine();
            ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct.VPCRef.isolatedSubnets;`);
            ts.writeLine(`const isolatedRouteTables = [`);
            ts.writeLine(`isolated_subnets[0].routeTable,`);
            ts.writeLine(`isolated_subnets[1].routeTable,`);
            ts.writeLine(`]`);
            ts.writeLine();
            neptune.initializeTesForEC2Vpc();
            ts.writeLine();
            neptune.initializeTestForSubnet(apiName, 0, '1', '0');
            ts.writeLine();
            neptune.initializeTestForSubnet(apiName, 1, '2', '1');
            ts.writeLine();
            neptune.initiaizeTestForRouteTable(apiName, '1');
            ts.writeLine();
            neptune.initiaizeTestForRouteTable(apiName, '2');
            neptune.initializeTestForSubnetRouteTableAssociation(1);
            ts.writeLine();
            neptune.initializeTestForSubnetRouteTableAssociation(2);
            ts.writeLine();
            neptune.initializeTestForSecurityGroup(apiName);
            ts.writeLine();
            neptune.initializeTestForSecurityGroupIngress(apiName);
            ts.writeLine(`const subnets = VpcNeptuneConstruct.VPCRef.isolatedSubnets;`);
            ts.writeLine(`const subnetRefArray = [];`);
            ts.writeLine(`for (let subnet of subnets) {`);
            ts.writeLine(`subnetRefArray.push({`);
            ts.writeLine(`Ref: stack.getLogicalId(subnet.node.defaultChild as cdk.CfnElement),`);
            ts.writeLine(`});`);
            ts.writeLine(`}`);
            ts.writeLine();
            neptune.initializeTestForDBSubnetGroup(apiName);
            ts.writeLine();
            neptune.initializeTestForDBCluster(apiName);
            ts.writeLine();
            neptune.initializeTestForDBInstance(apiName);
            ts.writeLine();
            neptune.initializeTestForCountResources('AWS::EC2::VPC', 1);
            neptune.initializeTestForCountResources('AWS::EC2::Subnet', 2);
            neptune.initializeTestForCountResources('AWS::EC2::RouteTable', 2);
            neptune.initializeTestForCountResources('AWS::EC2::SubnetRouteTableAssociation', 2);
            neptune.initializeTestForCountResources('AWS::EC2::SecurityGroup', 1);
            neptune.initializeTestForCountResources('AWS::EC2::SecurityGroupIngress', 1);
            neptune.initializeTestForCountResources('AWS::Neptune::DBCluster', 1);
            neptune.initializeTestForCountResources('AWS::Neptune::DBInstance', 1);
        }, output, cloud_api_constants_1.CONSTRUCTS.neptuneDb);
    });
}
