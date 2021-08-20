"use strict";
<<<<<<< HEAD
exports.__esModule = true;
var templating_1 = require("@yellicode/templating");
var typescript_1 = require("@yellicode/typescript");
var Neptune_1 = require("../../../Constructs/Neptune");
// import { Iam } from '../../../Constructs/Iam';
var Cdk_1 = require("../../../Constructs/Cdk");
var model = require("../../../model.json");
var USER_WORKING_DIRECTORY = model.USER_WORKING_DIRECTORY;
var subnet1 = '1';
var subnet2 = '2';
var fnNum0 = 0;
var fnNum1 = 1;
var isolatedRouteTables1 = 1;
var isolatedRouteTables2 = 2;
templating_1.Generator.generateFromModel({
    outputFile: "../../../../../test/" + USER_WORKING_DIRECTORY + "-neptune.test.ts"
}, function (output) {
    var ts = new typescript_1.TypeScriptWriter(output);
    var testClass = new Cdk_1.Cdk(output);
    var cdk = new Cdk_1.Cdk(output);
    var neptune = new Neptune_1.Neptune(output);
    var apiName = model.api.apiName;
    testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY);
    ts.writeLine();
    testClass.initializeTest2('Neptune Construct Tests', function () {
        ts.writeLine("const constructs = vpc.node.children;");
        ts.writeLine("expect(constructs).toHaveLength(5);");
        ts.writeLine("const isolated_subnets = vpc.VPCRef.isolatedSubnets;");
        ts.writeLine("const isolatedRouteTables = [");
        ts.writeLine("isolated_subnets[0].routeTable,");
        ts.writeLine("isolated_subnets[1].routeTable,");
=======
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Neptune_1 = require("../../../Constructs/Neptune");
// import { Iam } from '../../../Constructs/Iam';
const Cdk_1 = require("../../../Constructs/Cdk");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const subnet1 = '1';
const subnet2 = '2';
const fnNum0 = 0;
const fnNum1 = 1;
const isolatedRouteTables1 = 1;
const isolatedRouteTables2 = 2;
templating_1.Generator.generateFromModel({
    outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-neptune.test.ts`,
}, (output) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const testClass = new Cdk_1.Cdk(output);
    const cdk = new Cdk_1.Cdk(output);
    const neptune = new Neptune_1.Neptune(output);
    const { apiName } = model.api;
    testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY);
    ts.writeLine();
    testClass.initializeTest2('Neptune Construct Tests', () => {
        ts.writeLine(`const constructs = vpc.node.children;`);
        ts.writeLine(`expect(constructs).toHaveLength(5);`);
        ts.writeLine(`const isolated_subnets = vpc.VPCRef.isolatedSubnets;`);
        ts.writeLine(`const isolatedRouteTables = [`);
        ts.writeLine(`isolated_subnets[0].routeTable,`);
        ts.writeLine(`isolated_subnets[1].routeTable,`);
>>>>>>> 2fbb6ecf0cc95dc9963e0c07b8fbd2a14beea399
        ts.writeLine();
        neptune.initializeTesForEC2Vpc();
        ts.writeLine();
        neptune.initializeTestForSubnet(apiName, fnNum0, subnet1);
        ts.writeLine();
        neptune.initializeTestForSubnet(apiName, fnNum1, subnet2);
        ts.writeLine();
        neptune.initiaizeTestForRouteTable(apiName, subnet1);
        ts.writeLine();
        neptune.initiaizeTestForRouteTable(apiName, subnet2);
        neptune.initializeTestForSubnetRouteTableAssociation(isolatedRouteTables1);
        ts.writeLine();
        neptune.initializeTestForSubnetRouteTableAssociation(isolatedRouteTables2);
        ts.writeLine();
        neptune.initializeTestForSecurityGroup(apiName);
        ts.writeLine();
        neptune.initializeTestForSecurityGroupIngress(apiName);
<<<<<<< HEAD
        ts.writeLine("const subnets = vpc.VPCRef.isolatedSubnets;");
        ts.writeLine("const subnetRefArray = [];");
        ts.writeLine("for (let subnet of subnets) {");
        ts.writeLine("subnetRefArray.push({");
        ts.writeLine("Ref: stack.getLogicalId(subnet.node.defaultChild as CfnElement),");
        ts.writeLine("});");
        ts.writeLine("}");
=======
        ts.writeLine(`const subnets = vpc.VPCRef.isolatedSubnets;`);
        ts.writeLine(`const subnetRefArray = [];`);
        ts.writeLine(`for (let subnet of subnets) {`);
        ts.writeLine(`subnetRefArray.push({`);
        ts.writeLine(`Ref: stack.getLogicalId(subnet.node.defaultChild as CfnElement),`);
        ts.writeLine(`});`);
        ts.writeLine(`}`);
>>>>>>> 2fbb6ecf0cc95dc9963e0c07b8fbd2a14beea399
        ts.writeLine();
        neptune.initializeTestForDBSubnetGroup(apiName);
        ts.writeLine();
        neptune.initializeTestForDBCluster(apiName);
        ts.writeLine();
        neptune.initializeTestForDBInstance(apiName);
        ts.writeLine();
<<<<<<< HEAD
        ts.writeLine("expect(stack).toCountResources('AWS::EC2::VPC', 1);");
        ts.writeLine("expect(stack).toCountResources('AWS::EC2::Subnet', 2);");
        ts.writeLine("expect(stack).toCountResources('AWS::EC2::RouteTable', 2);");
        ts.writeLine("expect(stack).toCountResources('AWS::EC2::SubnetRouteTableAssociation', 2);");
        ts.writeLine("expect(stack).toCountResources('AWS::EC2::SecurityGroup', 1);");
        ts.writeLine("expect(stack).toCountResources('AWS::EC2::SecurityGroupIngress', 1);");
        ts.writeLine("expect(stack).toCountResources('AWS::Neptune::DBCluster', 1);");
        ts.writeLine("expect(stack).toCountResources('AWS::Neptune::DBInstance', 1);");
=======
        ts.writeLine(`expect(stack).toCountResources('AWS::EC2::VPC', 1);`);
        ts.writeLine(`expect(stack).toCountResources('AWS::EC2::Subnet', 2);`);
        ts.writeLine(`expect(stack).toCountResources('AWS::EC2::RouteTable', 2);`);
        ts.writeLine(`expect(stack).toCountResources('AWS::EC2::SubnetRouteTableAssociation', 2);`);
        ts.writeLine(`expect(stack).toCountResources('AWS::EC2::SecurityGroup', 1);`);
        ts.writeLine(`expect(stack).toCountResources('AWS::EC2::SecurityGroupIngress', 1);`);
        ts.writeLine(`expect(stack).toCountResources('AWS::Neptune::DBCluster', 1);`);
        ts.writeLine(`expect(stack).toCountResources('AWS::Neptune::DBInstance', 1);`);
>>>>>>> 2fbb6ecf0cc95dc9963e0c07b8fbd2a14beea399
    }, output, USER_WORKING_DIRECTORY);
});
