"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var core_1 = require("@yellicode/core");
var typescript_1 = require("@yellicode/typescript");
var Neptune = /** @class */ (function (_super) {
    __extends(Neptune, _super);
    function Neptune() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Neptune.prototype.importNeptune = function (output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_neptune as neptune"]);
    };
    Neptune.prototype.initializeNeptuneCluster = function (apiName, neptuneSubnetName, securityGroupName, output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: apiName + "_neptuneCluster",
            typeName: "",
            initializer: function () {
                ts.writeLine(" new neptune.CfnDBCluster(this, \"" + apiName + "Cluster\", {\n            dbSubnetGroupName: " + neptuneSubnetName + ".dbSubnetGroupName,\n            dbClusterIdentifier: \"" + apiName + "Cluster\",\n            vpcSecurityGroupIds: [" + securityGroupName + ".securityGroupId],\n          });");
            }
        }, "const");
    };
    Neptune.prototype.initializeNeptuneSubnet = function (apiName, vpcName, output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: apiName + "_neptuneSubnet",
            typeName: "",
            initializer: function () {
                ts.writeLine(" new neptune.CfnDBSubnetGroup(\n            this,\n            \"" + apiName + "neptuneSubnetGroup\",\n            {\n              dbSubnetGroupDescription: \"" + apiName + " Subnet\",\n              subnetIds: " + vpcName + ".selectSubnets({ subnetType: ec2.SubnetType.ISOLATED })\n                .subnetIds,\n              dbSubnetGroupName: \"" + apiName + "_subnetgroup\",\n            }\n          );");
            }
        }, "const");
    };
    Neptune.prototype.initializeNeptuneInstance = function (apiName, vpcName, neptuneClusterName, output) {
        var ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: apiName + "_neptuneInstance",
            typeName: "",
            initializer: function () {
                ts.writeLine("new neptune.CfnDBInstance(this, \"" + apiName + "instance\", {\n            dbInstanceClass: \"db.t3.medium\",\n            dbClusterIdentifier: " + neptuneClusterName + ".dbClusterIdentifier,\n            availabilityZone: " + vpcName + ".availabilityZones[0],\n          });");
            }
        }, "const");
    };
    Neptune.prototype.addDependsOn = function (sourceName, depended) {
        this.writeLine(depended + ".addDependsOn(" + sourceName + ")");
    };
    Neptune.prototype.initializeTesForEC2Vpc = function () {
        this.writeLine("expect(stack).toHaveResource('AWS::EC2::VPC', {\n        CidrBlock: '10.0.0.0/16',\n        EnableDnsHostnames: true,\n        EnableDnsSupport: true,\n        InstanceTenancy: 'default',\n      })");
    };
    Neptune.prototype.initializeTestForSubnet = function (apiName, fnNum, subnetNum) {
        this.writeLine("expect(stack).toHaveResource('AWS::EC2::Subnet', {\n      CidrBlock: '10.0.0.0/24',\n      VpcId: {\n        Ref: stack.getLogicalId(vpc.VPCRef.node.defaultChild as CfnElement),\n      },\n      AvailabilityZone: {\n        'Fn::Select': [\n          " + fnNum + ",\n          {\n            'Fn::GetAZs': '',\n          },\n        ],\n      },\n      MapPublicIpOnLaunch: false,\n      Tags: [\n        {\n          Key: 'aws-cdk:subnet-name',\n          Value: 'Ingress',\n        },\n        {\n          Key: 'aws-cdk:subnet-type',\n          Value: 'Isolated',\n        },\n        {\n          Key: 'Name',\n          Value: 'Default/neptuneTestStack/" + apiName + "/IngressSubnet" + subnetNum + "',\n        },\n      ],\n    });");
    };
    // public initializeTestForSubnet2(apiName: string) {
    //   this.writeLine(`expect(stack).toHaveResource('AWS::EC2::Subnet', {
    //     CidrBlock: '10.0.0.0/24',
    //     VpcId: {
    //       Ref: stack.getLogicalId(vpc.VPCRef.node.defaultChild as CfnElement),
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
    Neptune.prototype.initiaizeTestForRouteTable = function (apiName, subnetNum) {
        this.writeLine("expect(stack).toHaveResource('AWS::EC2::RouteTable', {\n      VpcId: {\n        Ref: stack.getLogicalId(vpc.VPCRef.node.defaultChild as CfnElement),\n      },\n      Tags: [\n        {\n          Key: 'Name',\n          Value: 'Default/neptuneTestStack/" + apiName + "/IngressSubnet" + subnetNum + "',\n        },\n      ],\n    });");
    };
    Neptune.prototype.initializeTestForSubnetRouteTableAssociation = function (isolatedRouteTablesNum) {
        this
            .writeLine("expect(stack).toHaveResource('AWS::EC2::SubnetRouteTableAssociation', {\n      RouteTableId: stack.resolve(isolatedRouteTables[0].routeTableId),\n      SubnetId: {\n        Ref: stack.getLogicalId(\n          isolated_subnets[0].node.defaultChild as CfnElement\n        ),\n      },\n    });");
    };
    // public initializeTestForvSubnetRouteTableAssociation() {
    //   this
    //     .writeLine(`expect(stack).toHaveResource('AWS::EC2::SubnetRouteTableAssociation', {
    //     RouteTableId: stack.resolve(isolatedRouteTables[1].routeTableId),
    //     SubnetId: {
    //       Ref: stack.getLogicalId(
    //         isolated_subnets[1].node.defaultChild as CfnElement
    //       ),
    //     },
    //   });`);
    // }
    Neptune.prototype.initializeTestForSecurityGroup = function (apiName) {
        this.writeLine("expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {\n    GroupDescription: '" + apiName + " security group',\n    GroupName: '" + apiName + "SecurityGroup',\n    SecurityGroupEgress: [\n      {\n        CidrIp: '0.0.0.0/0',\n        Description: 'Allow all outbound traffic by default',\n        IpProtocol: '-1',\n      },\n    ],\n    Tags: [\n      {\n        Key: 'Name',\n        Value: '" + apiName + "SecurityGroup',\n      },\n    ],\n    VpcId: {\n      \"Ref\":  stack.getLogicalId(vpc.VPCRef.node.defaultChild as CfnElement)\n    },\n  });\n");
    };
    Neptune.prototype.initializeTestForSecurityGroupIngress = function (apiName) {
        this
            .writeLine("expect(stack).toHaveResource('AWS::EC2::SecurityGroupIngress', {\n    IpProtocol: 'tcp',\n    Description: '" + apiName + "Rule',\n    FromPort: 8182,\n    GroupId: {\n      'Fn::GetAtt': [\n        stack.getLogicalId(vpc.SGRef.node.defaultChild as CfnElement),\n        'GroupId',\n      ],\n    },\n    SourceSecurityGroupId: {\n      'Fn::GetAtt': [\n        stack.getLogicalId(vpc.SGRef.node.defaultChild as CfnElement),\n        'GroupId',\n      ],\n    },\n    ToPort: 8182,\n  });");
    };
    Neptune.prototype.initializeTestForDBSubnetGroup = function (apiName) {
        this
            .writeLine("  expect(stack).toHaveResource('AWS::Neptune::DBSubnetGroup', {\n      DBSubnetGroupDescription: '" + apiName + " Subnet',\n      SubnetIds: subnetRefArray,\n      DBSubnetGroupName: '" + apiName + "_subnetgroup',\n    });");
    };
    Neptune.prototype.initializeTestForDBCluster = function (apiName) {
        this.writeLine("expect(stack).toHaveResource('AWS::Neptune::DBCluster', {\n      DBClusterIdentifier: '" + apiName + "Cluster',\n      DBSubnetGroupName: '" + apiName + "_subnetgroup',\n      VpcSecurityGroupIds: [\n        {\n          'Fn::GetAtt': [\n            stack.getLogicalId(vpc.SGRef.node.defaultChild as CfnElement),\n            'GroupId',\n          ],\n        },\n      ],\n    });");
    };
    Neptune.prototype.initializeTestForDBInstance = function (apiName) {
        this.writeLine("expect(stack).toHaveResource('AWS::Neptune::DBInstance', {\n    DBInstanceClass: 'db.t3.medium',\n    AvailabilityZone: {\n      'Fn::Select': [\n        0,\n        {\n          'Fn::GetAZs': '',\n        },\n      ],\n    },\n    DBClusterIdentifier: '" + apiName + "Cluster',\n  });");
    };
    return Neptune;
}(core_1.CodeWriter));
exports.Neptune = Neptune;
