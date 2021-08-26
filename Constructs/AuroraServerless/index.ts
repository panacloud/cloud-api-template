import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class AuroraServerless extends CodeWriter {
  public importRds(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_rds as rds"]);
  }

  public initializeAuroraCluster(
    apiName: string,
    vpcName: string,
    output: TextWriter
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_db`,
        typeName: "",
        initializer: () => {
          ts.writeLine(`new rds.ServerlessCluster(this, "${apiName}DB", {
            vpc: ${vpcName},
            engine: rds.DatabaseClusterEngine.auroraMysql({
              version: rds.AuroraMysqlEngineVersion.VER_5_7_12,
            }),
            scaling: {
              autoPause: Duration.minutes(10), 
              minCapacity: rds.AuroraCapacityUnit.ACU_8, 
              maxCapacity: rds.AuroraCapacityUnit.ACU_32,
            },
            deletionProtection: false,
            defaultDatabaseName: "${apiName}DB",
          });`);
        },
      },
      "const"
    );
  }

  public connectionsAllowFromAnyIpv4(sourceName: string) {
    this.writeLine(
      `${sourceName}.connections.allowFromAnyIpv4(ec2.Port.tcp(3306));`
    );
  }

  public initializeTestForEC2Vpc () {
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::VPC', {
      CidrBlock: '10.0.0.0/16',
      EnableDnsHostnames: true,
      EnableDnsSupport: true,
      InstanceTenancy: 'default',
    });
   `)
  }

  public initializeTestForSubnet (apiName: string, cidrBlock: string, fNum: number, state: string, stateNum: string) {
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::Subnet', {
      CidrBlock: '${cidrBlock}',
      VpcId: {
        Ref: stack.getLogicalId(AuroraDbConstruct_stack.vpcRef.node.defaultChild as cdk.CfnElement),
      },
      AvailabilityZone: {
        'Fn::Select': [
          ${fNum},
          {
            'Fn::GetAZs': '',
          },
        ],
      },
      MapPublicIpOnLaunch: true,
      Tags: [
        {
          Key: 'aws-cdk:subnet-name',
          Value: '${state}',
        },
        {
          Key: 'aws-cdk:subnet-type',
          Value: '${state}',
        },
        {
          Key: 'Name',
          Value: 'Default/AuroraDbConstructTest/${apiName}Vpc/${state}Subnet${stateNum}',
        },
      ],
    });`)
  }

  public initializeTestForRouteTable(apiName: string, state: string, stateNum: string) {
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::RouteTable', {
      VpcId: {
        Ref: stack.getLogicalId(AuroraDbConstruct_stack.vpcRef.node.defaultChild as cdk.CfnElement),
      },
      Tags: [
        {
          Key: 'Name',
          Value: 'Default/AuroraDbConstructTest/${apiName}Vpc/${state}Subnet${stateNum}',
        },
      ],
    });
  `)
  }

   
  public initializeTestForSubnetRouteTableAssociation(routeTableState: string, routeTableNum: number, subnet: string, subnetState: number) {
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::SubnetRouteTableAssociation', {
      RouteTableId: stack.resolve(${routeTableState}[${routeTableNum}].routeTableId),
      SubnetId: {
        Ref: stack.getLogicalId(
          ${subnet}[${subnetState}].node.defaultChild as cdk.CfnElement
        ),
      },
    });`)
  }

  public initializeTestForSecurityGroup() {
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::SecurityGroup', {
      GroupDescription: 'RDS security group',
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow all outbound traffic by default',
          IpProtocol: '-1',
        },
      ],
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'from 0.0.0.0/0:3306',
          FromPort: 3306,
          IpProtocol: 'tcp',
          ToPort: 3306,
        },
      ],
      VpcId: {
        Ref: stack.getLogicalId(AuroraDbConstruct_stack.vpcRef.node.defaultChild as cdk.CfnElement),
      },
    });
  `)
  }

  public initializeTestForRoute(routeTableState: string, routeTableNum: number, gatewatIdType:string , gatewayState: string) {
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::Route', {
      RouteTableId: stack.resolve(${routeTableState}[${routeTableNum}].routeTableId),
      DestinationCidrBlock: '0.0.0.0/0',
      ${gatewatIdType}: {
        Ref: stack.getLogicalId(${gatewayState}[0] as cdk.CfnElement),
      },
    });`)
  }

  public initializeTestForEIP(apiName: string, stateNum: string) {  
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::EIP', {
      Domain: 'vpc',
      Tags: [
        {
          Key: 'Name',
          Value: 'Default/AuroraDbConstructTest/${apiName}Vpc/PublicSubnet${stateNum}',
        },
      ],
    });`)
  }

  public initializeTestForNatGateway(apiName: string, subentNum: number, eipNum: string, stateNum: string) {
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::NatGateway', {
      SubnetId: {
        Ref: stack.getLogicalId(
          public_subnets[${subentNum}].node.defaultChild as cdk.CfnElement
        ),
      },
      AllocationId: {
        'Fn::GetAtt': [
          stack.getLogicalId(eip${eipNum}[0] as cdk.CfnElement),
          'AllocationId',
        ],
      },
      Tags: [
        {
          Key: 'Name',
          Value: 'Default/AuroraDbConstructTest/${apiName}Vpc/PublicSubnet${stateNum}',
        },
      ],
    });`)
  }

  public initializeTestForDBSubnetGroup(apiName: string) {
    this.writeLine(`expect(stack).toHaveResource('AWS::RDS::DBSubnetGroup', {
      DBSubnetGroupDescription: 'Subnets for ${apiName}DB database',
      SubnetIds: subnetRefArray,
    });`)
  }

  public ininitializeTestForRole() {
    this.writeLine(`expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });`)
  }

  public initializeTestForVPCGatewayAttachment() {
    this.writeLine(`expect(stack).toHaveResource('AWS::EC2::VPCGatewayAttachment', {
      VpcId: {
        Ref: stack.getLogicalId(AuroraDbConstruct_stack.vpcRef.node.defaultChild as cdk.CfnElement),
      },
      InternetGatewayId: {
        Ref: stack.getLogicalId(internetGateway[0] as cdk.CfnElement),
      },
    });
  `)}

  public initializeTestForCountResources(service: string, count: number) {
    this.writeLine(`expect(stack).toCountResources('${service}', ${count});`)
  }
}
