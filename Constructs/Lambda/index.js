"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../util/constant");
class Lambda extends core_1.CodeWriter {
    initializeLambda(apiName, output, lambdaStyle, functionName, vpcName, securityGroupsName, environments, vpcSubnets, roleName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        let lambdaConstructName = `${apiName}Lambda`;
        let lambdaVariable = `${apiName}_lambdaFn`;
        let funcName = `${apiName}Lambda`;
        let handlerName = "main.handler";
        let handlerAsset = "lambda-fns";
        let vpc = vpcName ? `vpc: ${vpcName},` : "";
        let securityGroups = securityGroupsName ? `securityGroups: [${securityGroupsName}],` : "";
        let env = environments ? `environment: {${environments.map((v) => `${v.name}: ${v.value}`)}},` : "";
        let vpcSubnet = vpcSubnets ? `vpcSubnets: { subnetType: ${vpcSubnets} },` : "";
        let role = roleName ? `role: ${roleName},` : "";
        if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
            lambdaConstructName = `${apiName}Lambda${functionName}`;
            lambdaVariable = `${apiName}_lambdaFn_${functionName}`;
            funcName = `${apiName}Lambda${functionName}`;
            handlerName = `${functionName}.handler`;
            handlerAsset = `lambda-fns/${functionName}`;
        }
        if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
            lambdaVariable = `${apiName}_lambdaFn_${functionName}`;
            funcName = `${apiName}Lambda${functionName}`;
            handlerName = `${functionName}.handler`;
        }
        ts.writeVariableDeclaration({
            name: lambdaVariable,
            typeName: "lambda.Function",
            initializer: () => {
                // ts.writeLine(`new lambda.Function(this,"${lambdaConstructName}", {
                ts.writeLine(`new lambda.Function(this, "${funcName}", {
        functionName: "${funcName}",
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: "${handlerName}",
        code: lambda.Code.fromAsset("${handlerAsset}"),
        layers:[${apiName}_lambdaLayer],
        ${role}
        ${vpc}
        ${securityGroups}
        ${env}
        ${vpcSubnet}
        })`);
            },
        }, "const");
    }
    lambdaLayer(output, apiName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${apiName}_lambdaLayer`,
            typeName: "lambda.LayerVersion",
            initializer: () => {
                ts.writeLine(`new lambda.LayerVersion(this, "${apiName}LambdaLayer", {
          code: lambda.Code.fromAsset('lambdaLayer'),
        })`);
            }
        }, "const");
    }
    addEnvironment(lambda, envName, value, lambdaStyle, functionName) {
        if (lambdaStyle === constant_1.LAMBDASTYLE.single) {
            this.writeLine(`${lambda}_lambdaFn.addEnvironment("${envName}", ${value});`);
        }
        else if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
            this.writeLine(`${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`);
        }
    }
    initializeTestForLambdaWithDynamoDB(funcName, handlerName) {
        this.writeLine(`expect(actual).to(
      haveResource("AWS::Lambda::Function", {
        FunctionName: "${funcName}",
        Handler: "${handlerName}.handler",
        Runtime: "nodejs12.x",
        Environment: {
          Variables: {
            TableName: {
              Ref: stack.getLogicalId(
                db_table[0].node.defaultChild as cdk.CfnElement
              ),
            },
          },
        },
      })
    );`);
    }
    initializeTestForLambdaWithNeptune(funcName, handlerName) {
        this.writeLine(`expect(stack).toHaveResource('AWS::Lambda::Function', {
    FunctionName: '${funcName}',
    Handler: '${handlerName}.handler',
    Runtime: 'nodejs12.x',
    Environment: {
      Variables: {
        NEPTUNE_ENDPOINT: {
          'Fn::GetAtt': [
            stack.getLogicalId(cfn_cluster[0] as cdk.CfnElement),
            'ReadEndpoint',
          ],
        },
      },
    },
    VpcConfig: {
      SecurityGroupIds: [
        {
          'Fn::GetAtt': [
            stack.getLogicalId(VpcNeptuneConstruct_stack.SGRef.node.defaultChild as cdk.CfnElement),
            'GroupId',
          ],
        },
      ],
      SubnetIds: [
        {
          Ref: stack.getLogicalId(isolated_subnets[0].node.defaultChild as cdk.CfnElement),
        },
        {
          Ref: stack.getLogicalId(isolated_subnets[1].node.defaultChild as cdk.CfnElement),
        },
      ],
    },
  });
`);
    }
    initializeTestForLambdaWithAuroradb(funcName, handlerName) {
        this.writeLine(`expect(stack).toHaveResource('AWS::Lambda::Function', {
    FunctionName: '${funcName}',
    Handler: '${handlerName}.handler',
    Runtime: 'nodejs12.x',
    Environment: {
      Variables: {
        INSTANCE_CREDENTIALS: {
          Ref: stack.getLogicalId(secretAttachment[0].node.defaultChild as cdk.CfnElement),
        },
      },
    },
  });`);
    }
}
exports.Lambda = Lambda;
