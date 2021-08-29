"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const Neptune_1 = require("../../../lib/Neptune");
const Cdk_1 = require("../../../lib/Cdk");
const constant_1 = require("../../../utils/constant");
const ConstructsImports_1 = require("../../../lib/ConstructsImports");
const functions_1 = require("./functions");
const Iam_1 = require("../../../lib/Iam");
const model = require(`../../../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const { database } = model.api;
if (database && database === constant_1.DATABASE.neptune) {
    templating_1.Generator.generate({
        outputFile: `${constant_1.PATH.test}${USER_WORKING_DIRECTORY}-neptunedb.test.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const cdk = new Cdk_1.Cdk(output);
        const neptune = new Neptune_1.Neptune(output);
        const imp = new ConstructsImports_1.Imports(output);
        const iam = new Iam_1.Iam(output);
        const { apiName } = model.api;
        imp.ImportsForTest(output, USER_WORKING_DIRECTORY, "pattern2");
        imp.importForNeptuneConstructInTest(output);
        ts.writeLine();
        cdk.initializeTest("Neptune Construct Tests", () => {
            ts.writeLine();
            iam.constructorIdentifier(constant_1.CONSTRUCTS.neptuneDb);
            ts.writeLine(`const constructs = VpcNeptuneConstruct_stack.node.children;`);
            ts.writeLine(`expect(constructs).toHaveLength(5);`);
            ts.writeLine();
            (0, functions_1.isolatedFunction)(output);
            ts.writeLine();
            neptune.initializeTesForEC2Vpc();
            ts.writeLine();
            neptune.initializeTestForSubnet(apiName, 0, "1", "0");
            ts.writeLine();
            neptune.initializeTestForSubnet(apiName, 1, "2", "1");
            ts.writeLine();
            neptune.initiaizeTestForRouteTable(apiName, "1");
            ts.writeLine();
            neptune.initiaizeTestForRouteTable(apiName, "2");
            neptune.initializeTestForSubnetRouteTableAssociation(1);
            ts.writeLine();
            neptune.initializeTestForSubnetRouteTableAssociation(2);
            ts.writeLine();
            neptune.initializeTestForSecurityGroup(apiName);
            ts.writeLine();
            neptune.initializeTestForSecurityGroupIngress(apiName);
            (0, functions_1.subnetFunction)(output);
            ts.writeLine();
            neptune.initializeTestForDBSubnetGroup(apiName);
            ts.writeLine();
            neptune.initializeTestForDBCluster(apiName);
            ts.writeLine();
            neptune.initializeTestForDBInstance(apiName);
            ts.writeLine();
            neptune.initializeTestForCountResources("AWS::EC2::VPC", 1);
            neptune.initializeTestForCountResources("AWS::EC2::Subnet", 2);
            neptune.initializeTestForCountResources("AWS::EC2::RouteTable", 2);
            neptune.initializeTestForCountResources("AWS::EC2::SubnetRouteTableAssociation", 2);
            neptune.initializeTestForCountResources("AWS::EC2::SecurityGroup", 1);
            neptune.initializeTestForCountResources("AWS::EC2::SecurityGroupIngress", 1);
            neptune.initializeTestForCountResources("AWS::Neptune::DBCluster", 1);
            neptune.initializeTestForCountResources("AWS::Neptune::DBInstance", 1);
        }, output, USER_WORKING_DIRECTORY, "pattern_v2");
    });
}
