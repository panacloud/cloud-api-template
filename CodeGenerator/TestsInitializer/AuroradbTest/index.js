"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const AuroraServerless_1 = require("../../../Constructs/AuroraServerless");
const Cdk_1 = require("../../../Constructs/Cdk");
const constant_1 = require("../../../constant");
const Iam_1 = require("../../../Constructs/Iam");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const functions_1 = require("./functions");
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const { database } = model.api;
if (database && database === constant_1.DATABASE.aurora) {
    templating_1.Generator.generate({
        outputFile: `${constant_1.PATH.test}${USER_WORKING_DIRECTORY}-auroradb.test.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const cdk = new Cdk_1.Cdk(output);
        const iam = new Iam_1.Iam(output);
        const auroradb = new AuroraServerless_1.AuroraServerless(output);
        const imp = new ConstructsImports_1.Imports(output);
        const { apiName } = model.api;
        imp.ImportsForTest(output, USER_WORKING_DIRECTORY, 'pattern2');
        cdk.importForAuroradbConstruct(output);
        ts.writeLine();
        cdk.initializeTest3("Auroradb Construct Tests", () => {
            ts.writeLine();
            iam.constructorIdentifier(constant_1.CONSTRUCTS.auroradb);
            ts.writeLine(`const public_subnets = AuroraDbConstruct_stack.vpcRef.publicSubnets;`);
            auroradb.route_tableIdentifier('public');
            ts.writeLine();
            ts.writeLine(`const private_subnets = AuroraDbConstruct_stack.vpcRef.privateSubnets;`);
            auroradb.route_tableIdentifier('private');
            ts.writeLine();
            iam.natgatewayIdentifier("1", 0);
            ts.writeLine();
            iam.natgatewayIdentifier("2", 1);
            ts.writeLine();
            iam.internetGatewayIdentifier();
            ts.writeLine();
            iam.eipIdentifier('1', 0);
            ts.writeLine();
            iam.eipIdentifier('2', 1);
            ts.writeLine();
            auroradb.initializeTestForEC2Vpc();
            ts.writeLine();
            auroradb.initializeTestForSubnet(apiName, '10.0.0.0/18', 0, true, 'Public', "1");
            ts.writeLine();
            auroradb.initializeTestForSubnet(apiName, '10.0.64.0/18', 1, true, 'Public', "2");
            ts.writeLine();
            auroradb.initializeTestForSubnet(apiName, '10.0.128.0/18', 0, false, 'Private', "1");
            ts.writeLine();
            auroradb.initializeTestForSubnet(apiName, '10.0.192.0/18', 1, false, 'Private', "2");
            ts.writeLine();
            auroradb.initializeTestForRouteTable(apiName, 'Public', "1");
            ts.writeLine();
            auroradb.initializeTestForRouteTable(apiName, 'Public', "2");
            ts.writeLine();
            auroradb.initializeTestForRouteTable(apiName, 'Private', "1");
            ts.writeLine();
            auroradb.initializeTestForRouteTable(apiName, 'Private', "2");
            ts.writeLine();
            auroradb.initializeTestForSubnetRouteTableAssociation("publicRouteTables", 0, 'routeTableId', '', "public_subnets", 0);
            ts.writeLine();
            auroradb.initializeTestForSubnetRouteTableAssociation("publicRouteTables", 1, 'routeTableId', '', "public_subnets", 1);
            ts.writeLine();
            auroradb.initializeTestForSubnetRouteTableAssociation("private_subnets", 0, 'routeTable', '.routeTableId', 'private_subnets', 0);
            ts.writeLine();
            auroradb.initializeTestForSubnetRouteTableAssociation("private_subnets", 1, 'routeTable', '.routeTableId', "private_subnets", 1);
            ts.writeLine();
            auroradb.initializeTestForSecurityGroup();
            ts.writeLine();
            auroradb.initializeTestForRoute("privateRouteTables", 0, "NatGatewayId", "natGateway1");
            ts.writeLine();
            auroradb.initializeTestForRoute("privateRouteTables", 1, "NatGatewayId", "natGateway2");
            ts.writeLine();
            auroradb.initializeTestForRoute("publicRouteTables", 0, "GatewayId", "internetGateway");
            ts.writeLine();
            auroradb.initializeTestForRoute("publicRouteTables", 1, "GatewayId", "internetGateway");
            ts.writeLine();
            auroradb.initializeTestForEIP(apiName, '1');
            ts.writeLine();
            auroradb.initializeTestForEIP(apiName, '2');
            ts.writeLine();
            auroradb.initializeTestForNatGateway(apiName, 0, '1', '1');
            ts.writeLine();
            auroradb.initializeTestForNatGateway(apiName, 1, '2', '2');
            ts.writeLine();
            (0, functions_1.subnetAuroraFunction)(output);
            ts.writeLine();
            auroradb.initializeTestForDBSubnetGroup(apiName);
            ts.writeLine();
            auroradb.ininitializeTestForRole();
            ts.writeLine();
            auroradb.initializeTestForCountResources("AWS::EC2::VPC", 1);
            auroradb.initializeTestForCountResources("AWS::EC2::Subnet", 4);
            auroradb.initializeTestForCountResources("AWS::EC2::RouteTable", 4);
            auroradb.initializeTestForCountResources("AWS::EC2::SubnetRouteTableAssociation", 4);
            auroradb.initializeTestForCountResources("AWS::EC2::Route", 4);
            auroradb.initializeTestForCountResources("AWS::EC2::SecurityGroup", 1);
            auroradb.initializeTestForCountResources("AWS::EC2::EIP", 2);
            auroradb.initializeTestForCountResources("AWS::EC2::NatGateway", 2);
            auroradb.initializeTestForCountResources("AWS::RDS::DBSubnetGroup", 1);
        }, output, USER_WORKING_DIRECTORY, "pattern_v2");
    });
}
