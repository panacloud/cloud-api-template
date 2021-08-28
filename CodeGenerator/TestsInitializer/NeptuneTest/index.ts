import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '@yellicode/typescript';
import { Neptune } from '../../../Constructs/Neptune';
// import { Iam } from '../../../Constructs/Iam';
import { Cdk } from '../../../Constructs/Cdk';
import { CONSTRUCTS, DATABASE, PATH } from '../../../constant';
import { Imports } from '../../../Constructs/ConstructsImports';
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const { database } = model.api;

if (database && database === DATABASE.neptune) {
  Generator.generate(
    {
      outputFile: `${PATH.test}${USER_WORKING_DIRECTORY}-lambda.test.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const cdk = new Cdk(output);
      const neptune = new Neptune(output);
      const imp = new Imports(output)
      const { apiName } = model.api;
      imp.ImportsForTest(output, USER_WORKING_DIRECTORY, 'pattern2');
      imp.importForNeptuneConstruct(output)
      ts.writeLine();
      cdk.initializeTest2(
        'Neptune Construct Tests',
        () => {
          ts.writeLine(`const constructs = VpcNeptuneConstruct_stack.node.children;`);
          ts.writeLine(`expect(constructs).toHaveLength(5);`);
          ts.writeLine()
          ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`);
          ts.writeLine(`const isolatedRouteTables = [`);
          ts.writeLine(`isolated_subnets[0].routeTable,`);
          ts.writeLine(`isolated_subnets[1].routeTable,`);
          ts.writeLine(`]`)
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
          ts.writeLine(`const subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`);
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
          neptune.initializeTestForCountResources('AWS::EC2::VPC', 1)
          neptune.initializeTestForCountResources('AWS::EC2::Subnet', 2)
          neptune.initializeTestForCountResources('AWS::EC2::RouteTable', 2)
          neptune.initializeTestForCountResources('AWS::EC2::SubnetRouteTableAssociation', 2)
          neptune.initializeTestForCountResources('AWS::EC2::SecurityGroup', 1)
          neptune.initializeTestForCountResources('AWS::EC2::SecurityGroupIngress', 1)
          neptune.initializeTestForCountResources('AWS::Neptune::DBCluster', 1)
          neptune.initializeTestForCountResources('AWS::Neptune::DBInstance', 1)
        },
        output,
        CONSTRUCTS.neptuneDb
      );
    }
  );
}
