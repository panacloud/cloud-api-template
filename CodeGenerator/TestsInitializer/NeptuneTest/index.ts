import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '@yellicode/typescript';
import { Neptune } from '../../../Constructs/Neptune';
import { Cdk } from '../../../Constructs/Cdk';
import { CONSTRUCTS, DATABASE, PATH } from '../../../constant';
import { Imports } from '../../../Constructs/ConstructsImports';
import { isolatedFunction, subnetFunction } from './functions';
import { Iam } from '../../../Constructs/Iam';
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;
const { database } = model.api;

if (database && database === DATABASE.neptune) {
  Generator.generate(
    {
      outputFile: `${PATH.test}${USER_WORKING_DIRECTORY}-neptunedb.test.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const cdk = new Cdk(output);
      const neptune = new Neptune(output);
      const imp = new Imports(output)
      const iam = new Iam(output)
      const { apiName } = model.api;
      imp.ImportsForTest(output, USER_WORKING_DIRECTORY, 'pattern2');
      imp.importForNeptuneConstructInTest(output)
      ts.writeLine();
      cdk.initializeTest(
        'Neptune Construct Tests',
        () => {
          ts.writeLine()
          iam.constructorIdentifier(CONSTRUCTS.neptuneDb)
          ts.writeLine(`const constructs = VpcNeptuneConstruct_stack.node.children;`);
          ts.writeLine(`expect(constructs).toHaveLength(5);`);
          ts.writeLine()
          isolatedFunction(output)
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
          subnetFunction(output)
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
        USER_WORKING_DIRECTORY,
        "pattern_v2"
      );
    }
  );
}
