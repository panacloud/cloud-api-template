"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neptune = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Neptune extends core_1.CodeWriter {
    importNeptune(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_neptune as neptune"]);
    }
    initializeNeptuneCluster(apiName, neptuneSubnetName, securityGroupName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${apiName}_neptuneCluster`,
            typeName: "",
            initializer: () => {
                ts.writeLine(` new neptune.CfnDBCluster(this, "${apiName}Cluster", {
            dbSubnetGroupName: ${neptuneSubnetName}.dbSubnetGroupName,
            dbClusterIdentifier: "${apiName}Cluster",
            vpcSecurityGroupIds: [${securityGroupName}.securityGroupId],
          });`);
            },
        }, "const");
    }
    initializeNeptuneSubnet(apiName, vpcName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${apiName}_neptuneSubnet`,
            typeName: "",
            initializer: () => {
                ts.writeLine(` new neptune.CfnDBSubnetGroup(
            this,
            "${apiName}neptuneSubnetGroup",
            {
              dbSubnetGroupDescription: "${apiName} Subnet",
              subnetIds: ${vpcName}.selectSubnets({ subnetType: ec2.SubnetType.ISOLATED })
                .subnetIds,
              dbSubnetGroupName: "${apiName}_subnetgroup",
            }
          );`);
            },
        }, "const");
    }
    initializeNeptuneInstance(apiName, vpcName, neptuneClusterName, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${apiName}_neptuneInstance`,
            typeName: "",
            initializer: () => {
                ts.writeLine(`new neptune.CfnDBInstance(this, "${apiName}instance", {
            dbInstanceClass: "db.t3.medium",
            dbClusterIdentifier: ${neptuneClusterName}.dbClusterIdentifier,
            availabilityZone: ${vpcName}.availabilityZones[0],
          });`);
            },
        }, "const");
    }
    addDependsOn(sourceName, depended) {
        this.writeLine(`${depended}.addDependsOn(${sourceName})`);
    }
    initializeTesForEC2Vpc() {
        this.writeLine(`expect(stack).toHaveResource('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
        EnableDnsHostnames: true,
        EnableDnsSupport: true,
        InstanceTenancy: 'default',
      })`);
    }
    initializeTestForSubnet(apiName, fnNum, subnetNum, cidr) {
        this.writeLine(`expect(stack).toHaveResource('AWS::EC2::Subnet', {
      CidrBlock: '10.0.${cidr}.0/24',
      VpcId: {
        Ref: stack.getLogicalId(VpcNeptuneConstruct-stack.VPCRef.node.defaultChild as cdk.CfnElement),
      },
      AvailabilityZone: {
        'Fn::Select': [
          ${fnNum},
          {
            'Fn::GetAZs': '',
          },
        ],
      },
      MapPublicIpOnLaunch: false,
      Tags: [
        {
          Key: 'aws-cdk:subnet-name',
          Value: 'Ingress',
        },
        {
          Key: 'aws-cdk:subnet-type',
          Value: 'Isolated',
        },
        {
          Key: 'Name',
          Value: 'Default/neptuneTestStack/${apiName}Vpc/IngressSubnet${subnetNum}',
        },
      ],
    });`);
    }
    // public initializeTestForSubnet2(apiName: string) {
    //   this.writeLine(`expect(stack).toHaveResource('AWS::EC2::Subnet', {
    //     CidrBlock: '10.0.0.0/24',
    //     VpcId: {
    //       Ref: stack.getLogicalId(vpc.VPCRef.node.defaultChild as cdk.CfnElement),
    //     },
    //     AvailabilityZone: {
    //       'Fn::Select': [
    //         1,
    //         {
    //           'Fn::GetAZs': '',
    //         },
    //       ],
    //     },
    //     MapPublicIpOnLaunch: false,
    //     Tags: [
    //       {
    //         Key: 'aws-cdk:subnet-name',
    //         Value: 'Ingress',
    //       },
    //       {
    //         Key: 'aws-cdk:subnet-type',
    //         Value: 'Isolated',
    //       },
    //       {
    //         Key: 'Name',
    //         Value: 'Default/neptuneTestStack/${apiName}/IngressSubnet2',
    //       },
    //     ],
    //   });`);
    // }
    initiaizeTestForRouteTable(apiName, subnetNum) {
        this.writeLine(`expect(stack).toHaveResource('AWS::EC2::RouteTable', {
      VpcId: {
        Ref: stack.getLogicalId(VpcNeptuneConstruct-stack.VPCRef.node.defaultChild as cdk.CfnElement),
      },
      Tags: [
        {
          Key: 'Name',
          Value: 'Default/neptuneTestStack/${apiName}Vpc/IngressSubnet${subnetNum}',
        },
      ],
    });`);
    }
    initializeTestForSubnetRouteTableAssociation(isolatedRouteTablesNum) {
        this
            .writeLine(`expect(stack).toHaveResource('AWS::EC2::SubnetRouteTableAssociation', {
      RouteTableId: stack.resolve(isolatedRouteTables[0].routeTableId),
      SubnetId: {
        Ref: stack.getLogicalId(
          isolated_subnets[0].node.defaultChild as cdk.CfnElement
        ),
      },
    });`);
    }
    // public initializeTestForvSubnetRouteTableAssociation() {
    //   this
    //     .writeLine(`expect(stack).toHaveResource('AWS::EC2::SubnetRouteTableAssociation', {
    //     RouteTableId: stack.resolve(isolatedRouteTables[1].routeTableId),
    //     SubnetId: {
    //       Ref: stack.getLogicalId(
    //         isolated_subnets[1].node.defaultChild as cdk.CfnElement
    //       ),
    //     },
    //   });`);
    // }
    initializeTestForSecurityGroup(apiName) {
        this.writeLine(`expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
    GroupDescription: '${apiName} security group',
    GroupName: '${apiName}SecurityGroup',
    SecurityGroupEgress: [
      {
        CidrIp: '0.0.0.0/0',
        Description: 'Allow all outbound traffic by default',
        IpProtocol: '-1',
      },
    ],
    Tags: [
      {
        Key: 'Name',
        Value: '${apiName}SecurityGroup',
      },
    ],
    VpcId: {
      "Ref":  stack.getLogicalId(VpcNeptuneConstruct-stack.VPCRef.node.defaultChild as cdk.CfnElement)
    },
  });
`);
    }
    initializeTestForSecurityGroupIngress(apiName) {
        this
            .writeLine(`expect(stack).toHaveResource('AWS::EC2::SecurityGroupIngress', {
    IpProtocol: 'tcp',
    Description: '${apiName}Rule',
    FromPort: 8182,
    GroupId: {
      'Fn::GetAtt': [
        stack.getLogicalId(VpcNeptuneConstruct-stack.SGRef.node.defaultChild as cdk.CfnElement),
        'GroupId',
      ],
    },
    SourceSecurityGroupId: {
      'Fn::GetAtt': [
        stack.getLogicalId(VpcNeptuneConstruct-stack.SGRef.node.defaultChild as cdk.CfnElement),
        'GroupId',
      ],
    },
    ToPort: 8182,
  });`);
    }
    initializeTestForDBSubnetGroup(apiName) {
        this
            .writeLine(`  expect(stack).toHaveResource('AWS::Neptune::DBSubnetGroup', {
      DBSubnetGroupDescription: '${apiName} Subnet',
      SubnetIds: subnetRefArray,
      DBSubnetGroupName: '${apiName}_subnetgroup',
    });`);
    }
    initializeTestForDBCluster(apiName) {
        this.writeLine(`expect(stack).toHaveResource('AWS::Neptune::DBCluster', {
      DBClusterIdentifier: '${apiName}Cluster',
      DBSubnetGroupName: '${apiName}_subnetgroup',
      VpcSecurityGroupIds: [
        {
          'Fn::GetAtt': [
            stack.getLogicalId(VpcNeptuneConstruct-stack.SGRef.node.defaultChild as cdk.CfnElement),
            'GroupId',
          ],
        },
      ],
    });`);
    }
    initializeTestForDBInstance(apiName) {
        this.writeLine(`expect(stack).toHaveResource('AWS::Neptune::DBInstance', {
    DBInstanceClass: 'db.t3.medium',
    AvailabilityZone: {
      'Fn::Select': [
        0,
        {
          'Fn::GetAZs': '',
        },
      ],
    },
    DBClusterIdentifier: '${apiName}Cluster',
  });`);
    }
    initializeTestForCountResources(service, count) {
        this.writeLine(`expect(stack).toCountResources('${service}', ${count});`);
    }
}
exports.Neptune = Neptune;
