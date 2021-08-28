import { CodeWriter, TextWriter } from '@yellicode/core';
import { TypeScriptWriter } from '@yellicode/typescript';

export class Iam extends CodeWriter {
  public serviceRoleForLambda(
    apiName: string,
    output: TextWriter,
    managedPolicies?: string[]
  ) {
    const ts = new TypeScriptWriter(output);
    const policies = managedPolicies
      ? `managedPolicies: [
      ${managedPolicies.map(
        (v) => `iam.ManagedPolicy.fromAwsManagedPolicyName("${v}")`
      )}
    ],`
      : ' ';

    ts.writeVariableDeclaration(
      {
        name: `${apiName}Lambda_serviceRole`,
        typeName: 'iam.Role',
        initializer: () => {
          ts.writeLine(`new iam.Role(this,'lambdaServiceRole',{
                assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
               ${policies}
          });`);
        },
      },
      'const'
    );
  }

  public serviceRoleForAppsync(output: TextWriter, apiName: string) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_serviceRole`,
        typeName: 'iam.Role',
        initializer: () => {
          ts.writeLine(`new iam.Role(this,'appsyncServiceRole',{
                assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
               });`);
        },
      },
      'const'
    );
  }

  public attachLambdaPolicyToRole(roleName: string) {
    this
      .writeLine(`${roleName}_serviceRole.addToPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['lambda:InvokeFunction'],
          }));`);
  }

  public appsyncServiceRoleTest() {
    this.writeLine(`expect(actual).to(
      haveResource("AWS::IAM::Role", {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "appsync.amazonaws.com",
              },
            },
          ],
          Version: "2012-10-17",
        },
      })
    );`);
  }

  public appsyncRolePolicyTest() {
    this.writeLine(`  expect(actual).to(
      haveResource("AWS::IAM::Policy", {
        PolicyDocument: {
          Statement: [
            {
              Action: "lambda:InvokeFunction",
              Effect: "Allow",
              Resource: "*",
            },
          ],
          Version: "2012-10-17",
        },
        Roles: [
          {
            Ref: stack.getLogicalId(role[0].node.defaultChild as cdk.CfnElement),
          },
        ],
      })
    );`);
    this.writeLine();
  }

  public lambdaServiceRoleTest() {
    this.writeLine(`expect(actual).to(
      haveResource("AWS::IAM::Role", {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "lambda.amazonaws.com",
              },
            },
          ],
          Version: "2012-10-17",
        },
      })
    );`);
  }

  public lambdaServiceRolePolicyTestForDynodb(policyCount: number) {
    this.writeLine(`expect(actual).to(
        countResourcesLike("AWS::IAM::Policy",${policyCount}, {
          PolicyDocument: {
            Statement: [
              {
                Action: "dynamodb:*",
                Effect: "Allow",
                Resource: [
                  {
                    "Fn::GetAtt": [
                      stack.getLogicalId(
                        db_table[0].node.defaultChild as cdk.CfnElement
                      ),
                      "Arn",
                    ],
                  },
                  {
                    Ref: "AWS::NoValue",
                  },
                ],
              },
            ],
            Version: "2012-10-17",
          }
        })
      );`);
  }

  public roleIdentifierFromStack() {
    this.writeLine(`const role = stack.node.children.filter((elem) => {
      return elem instanceof cdk.aws_iam.Role;
    });`);
  }

  public lambdaIdentifierFromStack() {
    this.writeLine(`const lambda_func = stack.node.children.filter((elem) => {
      return elem instanceof cdk.aws_lambda.Function;
    });`);
  }

  public roleIdentifierFromLambda() {
    this
      .writeLine(`const lambda_role = lambda_func[0].node.children.filter((elem) => {
      return elem instanceof cdk.aws_iam.Role;
    });`);
  }

  public dynamodbConsturctIdentifier() {
    this.writeLine(`const dbConstruct = stack.node.children.filter(elem => {
        return elem instanceof DynamodbConstruct;
      });`);
  }

  public lambdaConsturctIdentifier() {
    this.writeLine(`const Lambda_consturct = stack.node.children.filter(
      (elem) => elem instanceof LambdaConstruct
    );`);
  }

  public lambdaIdentifier() {
    this
      .writeLine(`const lambda_func = Lambda_consturct[0].node.children.filter(
      (elem) => elem instanceof cdk.aws_lambda.Function
    );`);
  }

  public appsyncConsturctIdentifier() {
    this.writeLine(`const Appsync_consturct = stack.node.children.filter(
      (elem) => elem instanceof AppsyncConstruct
    );`);
  }

  public appsyncApiIdentifier() {
    this
      .writeLine(`const appsync_api = Appsync_consturct[0].node.children.filter(
      (elem) => elem instanceof cdk.aws_appsync.CfnGraphQLApi
    );`);
  }

  public appsyncRoleIdentifier() {
    this
      .writeLine(`const role = Appsync_consturct[0].node.children.filter((elem) => {
      return elem instanceof cdk.aws_iam.Role;
    });`);
  }

  public DynodbTableIdentifier() {
    this
      .writeLine(`const db_table = dbConstruct[0].node.children.filter((elem) => {
      return elem instanceof cdk.aws_dynamodb.Table;
    });`);
  }

  public natgatewayIdentifier(natGatewayNum: string, subnetNum: number) {
    this
      .writeLine(`const natGateway${natGatewayNum} = public_subnets[${subnetNum}].node.children.filter((elem) => {
      return elem instanceof cdk.aws_ec2.CfnNatGateway;
    });`);
  }

  public eipIdentifier(epiNum: string, subnetNum: number) {
    this
      .writeLine(`const eip${epiNum} = public_subnets[${subnetNum}].node.children.filter((elem) => {
      return elem instanceof cdk.aws_ec2.CfnEIP;
    });`);
  }

  public internetGatewayIdentifier() {
    this
      .writeLine(`const internetGateway = AuroraDbConstruct_stack.vpcRef.node.children.filter((elem) => {
      return elem instanceof cdk.aws_ec2.CfnInternetGateway;
    });`);
  }

  public serverlessClusterIdentifier() {
    this
      .writeLine(`const ServerlessCluster = AuroraDbConstruct_stack.node.children.filter((elem) => {
      return elem instanceof cdk.aws_rds.ServerlessCluster;
    }); `);
  }

  public secretIdentifier() {
    this
      .writeLine(`const secret = ServerlessCluster[0].node.children.filter((elem) => {
      return elem instanceof cdk.aws_secretsmanager.Secret;
    });`);
  }

  public secretAttachment() {
    this
      .writeLine(`const secretAttachment = secret[0].node.children.filter((elem) => {
      return elem instanceof cdk.aws_secretsmanager.SecretTargetAttachment;
    });`);
  }

  public constructorIdentifier(constructor: string) {
    `const ${constructor}_stack = new ${constructor}(stack, "${constructor}Test");` 
  }
}
