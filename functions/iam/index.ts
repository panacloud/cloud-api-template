import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class Iam extends CodeWriter {
  public importIam(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_iam as iam"]);
  }

  public serviceRoleForAppsync(output: TextWriter, apiName: string) {
    const ts = new TypeScriptWriter(output);
    ts.writeVariableDeclaration(
      {
        name: `${apiName}_servRole`,
        typeName: "iam.Role",
        initializer: () => {
          ts.writeLine(`new iam.Role(this,'appsyncServiceRole',{
                assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
               });`);
        },
      },
      "const"
    );
  }

  public attachLambdaPolicyToRole(roleName: string) {
    this.writeLine(`${roleName}_servRole.addToPolicy(new iam.PolicyStatement({
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

  public lambdaServiceRoleTest(){
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
    );`)
  }

  public lambdaServiceRolePolicyTestForDynodb(policyCount:number){
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
                        dbConstruct[0].node.defaultChild as cdk.CfnElement
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
      );`)
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
    this.writeLine(`const lambda_role = lambda_func[0].node.children.filter((elem) => {
      return elem instanceof cdk.aws_iam.Role;
    });`);
  }

  public DynodbIdentifierFromStack() {
    this.writeLine(`const dbConstruct = stack.node.children.filter((elem) => {
      return elem instanceof cdk.aws_dynamodb.Table;
    });`);
  }
}