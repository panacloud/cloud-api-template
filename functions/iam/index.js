"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Iam = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Iam extends core_1.CodeWriter {
    importIam(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_iam as iam"]);
    }
    serviceRoleForAppsync(output, apiName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${apiName}_servRole`,
            typeName: "iam.Role",
            initializer: () => {
                ts.writeLine(`new iam.Role(this,'appsyncServiceRole',{
                assumedBy: new iam.ServicePrincipal('appsync.amazonaws.com'),
               });`);
            },
        }, "const");
    }
    attachLambdaPolicyToRole(roleName) {
        this.writeLine(`${roleName}_servRole.addToPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['lambda:InvokeFunction'],
          }));`);
    }
    appsyncServiceRoleTest() {
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
    appsyncRolePolicyTest() {
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
    lambdaServiceRoleTest() {
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
    lambdaServiceRolePolicyTestForDynodb() {
        this.writeLine(`expect(actual).to(
        haveResource("AWS::IAM::Policy", {
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
          },
          Roles: [
            {
              Ref: stack.getLogicalId(lambda_role[0].node.defaultChild as cdk.CfnElement),
            },
          ],
        })
      );`);
    }
    roleIdentifierFromStack() {
        this.writeLine(`const role = stack.node.children.filter((elem) => {
      return elem instanceof cdk.aws_iam.Role;
    });`);
    }
    lambdaIdentifierFromStack() {
        this.writeLine(`const lambda_func = stack.node.children.filter((elem) => {
      return elem instanceof cdk.aws_lambda.Function;
    });`);
    }
    roleIdentifierFromLambda() {
        this.writeLine(`const lambda_role = lambda_func[0].node.children.filter((elem) => {
      return elem instanceof cdk.aws_iam.Role;
    });`);
    }
    DynodbIdentifierFromStack() {
        this.writeLine(`const dbConstruct = stack.node.children.filter((elem) => {
      return elem instanceof cdk.aws_dynamodb.Table;
    });`);
    }
}
exports.Iam = Iam;
