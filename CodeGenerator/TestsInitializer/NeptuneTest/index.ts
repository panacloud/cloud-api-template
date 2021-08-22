import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '@yellicode/typescript';
import { Neptune } from '../../../Constructs/Neptune';
// import { Iam } from '../../../Constructs/Iam';
import { Cdk } from '../../../Constructs/Cdk';
import { DATABASE } from '../../../cloud-api-constants';
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const { database } = model.api;

const subnet1 = '1';
const subnet2 = '2';
const fnNum0 = 0;
const fnNum1 = 1;
const isolatedRouteTables1 = 1;
const isolatedRouteTables2 = 2;

if (database && database === DATABASE.neptuneDb) {
  Generator.generateFromModel(
    {
      outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-neptune.test.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const testClass = new Cdk(output);
      const cdk = new Cdk(output);
      const neptune = new Neptune(output);
      const { apiName } = model.api;
      testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY);
      cdk.importForNeptuneConstruct(output)
      ts.writeLine();
      testClass.initializeTest2(
        'Neptune Construct Tests',
        () => {
          ts.writeLine(`const constructs = vpc.node.children;`);
          ts.writeLine(`expect(constructs).toHaveLength(5);`);
          ts.writeLine()
          ts.writeLine(`const isolated_subnets = vpc.VPCRef.isolatedSubnets;`);
          ts.writeLine(`const isolatedRouteTables = [`);
          ts.writeLine(`isolated_subnets[0].routeTable,`);
          ts.writeLine(`isolated_subnets[1].routeTable,`);
          ts.writeLine(`]`)
          ts.writeLine();
          neptune.initializeTesForEC2Vpc();
          ts.writeLine();
          neptune.initializeTestForSubnet(apiName, fnNum0, subnet1, '0');
          ts.writeLine();
          neptune.initializeTestForSubnet(apiName, fnNum1, subnet2, '1');
          ts.writeLine();
          neptune.initiaizeTestForRouteTable(apiName, subnet1);
          ts.writeLine();
          neptune.initiaizeTestForRouteTable(apiName, subnet2);
          neptune.initializeTestForSubnetRouteTableAssociation(
            isolatedRouteTables1
          );
          ts.writeLine();
          neptune.initializeTestForSubnetRouteTableAssociation(
            isolatedRouteTables2
          );
          ts.writeLine();
          neptune.initializeTestForSecurityGroup(apiName);
          ts.writeLine();
          neptune.initializeTestForSecurityGroupIngress(apiName);
          ts.writeLine(`const subnets = vpc.VPCRef.isolatedSubnets;`);
          ts.writeLine(`const subnetRefArray = [];`);
          ts.writeLine(`for (let subnet of subnets) {`);
          ts.writeLine(`subnetRefArray.push({`);
          ts.writeLine(
            `Ref: stack.getLogicalId(subnet.node.defaultChild as cdk.CfnElement),`
          );
          ts.writeLine(`});`);
          ts.writeLine(`}`);
          ts.writeLine();
          neptune.initializeTestForDBSubnetGroup(apiName);
          ts.writeLine();
          neptune.initializeTestForDBCluster(apiName);
          ts.writeLine();
          neptune.initializeTestForDBInstance(apiName);
          ts.writeLine();
          //   ts.writeLine(`expect(stack).toCountResources('AWS::EC2::VPC', 1);`)
          //   ts.writeLine(`expect(stack).toCountResources('AWS::EC2::Subnet', 2);`)
          //   ts.writeLine(`expect(stack).toCountResources('AWS::EC2::RouteTable', 2);`)
          //   ts.writeLine(`expect(stack).toCountResources('AWS::EC2::SubnetRouteTableAssociation', 2);`)
          //   ts.writeLine(`expect(stack).toCountResources('AWS::EC2::SecurityGroup', 1);`)
          //   ts.writeLine(`expect(stack).toCountResources('AWS::EC2::SecurityGroupIngress', 1);`)
          //   ts.writeLine(`expect(stack).toCountResources('AWS::Neptune::DBCluster', 1);`)
          //   ts.writeLine(`expect(stack).toCountResources('AWS::Neptune::DBInstance', 1);`)
        },
        output,
        USER_WORKING_DIRECTORY
      );
    }
  );
}
