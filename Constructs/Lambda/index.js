"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lambda = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../constant");
class Lambda extends core_1.CodeWriter {
    initializeLambda(apiName, output, lambdaStyle, functionName, vpcName, securityGroupsName, environments, vpcSubnets, roleName) {
        const ts = new typescript_1.TypeScriptWriter(output);
        let lambdaConstructName = `${apiName}Lambda`;
        let lambdaVariable = `${apiName}_lambdaFn`;
        let funcName = `${apiName}Lambda`;
        let handlerName = "main.handler";
        let vpc = vpcName ? `vpc: ${vpcName},` : "";
        let securityGroups = securityGroupsName
            ? `securityGroups: [${securityGroupsName}],`
            : "";
        let env = environments
            ? `environment: {${environments.map((v) => `${v.name}: ${v.value}`)},},`
            : "";
        let vpcSubnet = vpcSubnets
            ? `vpcSubnets: { subnetType: ${vpcSubnets} },`
            : "";
        let role = roleName ? `role: ${roleName},` : "";
<<<<<<< HEAD
        if (lambdaStyle === constant_1.LAMBDASTYLE.multi) {
=======
        if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
            lambdaConstructName = `${apiName}Lambda${functionName}`;
<<<<<<< HEAD
>>>>>>> 97ae2538fc56736641690bc8efe05574e6cc766c
=======
>>>>>>> 97ae2538fc56736641690bc8efe05574e6cc766c
            lambdaVariable = `${apiName}_lambdaFn_${functionName}`;
            funcName = `${apiName}Lambda${functionName}`;
            handlerName = `${functionName}.handler`;
        }
        ts.writeVariableDeclaration({
            name: lambdaVariable,
            typeName: "lambda.Function",
            initializer: () => {
                ts.writeLine(`new lambda.Function(this,"${lambdaConstructName}", {
        functionName: "${funcName}",
        runtime: lambda.Runtime.NODEJS_12_X,
        handler: "${handlerName}",
        code: lambda.Code.fromAsset("lambda-fns"),
        ${role}
       ${vpc}
        ${securityGroups}
        ${env}
        ${vpcSubnet}
        })`);
            },
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
}
exports.Lambda = Lambda;
