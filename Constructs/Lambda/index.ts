import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LAMBDA } from "../../cloud-api-constants";

interface Environment {
  name: string;
  value: string;
}

export class Lambda extends CodeWriter {
  public importLambda(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_lambda as lambda"]);
  }

  public initializeLambda(apiName: string,output: TextWriter,lambdaStyle: string,functionName?: string,vpcName?: string,securityGroupsName?: string,environments?: Environment[],vpcSubnets?: string,roleName?: string) {

    let lambdaVariable:string = `${apiName}_lambdaFn`
    let funcName :string = `${apiName}Lambda`
    let handlerName:string = "main.handler"    
    const ts = new TypeScriptWriter(output);
    let vpc = vpcName ? `vpc: ${vpcName},` : "";
    let securityGroups = securityGroupsName ? `securityGroups: [${securityGroupsName}],`: "";
    let env = environments ? `environment: {${environments.map((v) => `${v.name}: ${v.value}`)},},` : "";
    let vpcSubnet = vpcSubnets ? `vpcSubnets: { subnetType: ${vpcSubnets} },` : "";
    let role = roleName ? `role: ${roleName},` : "";
     
     if (lambdaStyle === LAMBDA.multiple) {
       lambdaVariable = `${apiName}_lambdaFn_${functionName}`
       funcName  = `${apiName}Lambda${functionName}`
       handlerName = `${functionName}.handler`
     }

     ts.writeVariableDeclaration(
      {
        name: lambdaVariable,
        typeName: "lambda.Function",
        initializer: () => {
          ts.writeLine(`new lambda.Function(this, "${apiName}Lambda", {
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
      },
      "const"
    );
  }

  public addEnvironment(
    lambda: string,
    envName: string,
    value: string,
    lambdaStyle: string,
    functionName?: string
  ) {
    if (lambdaStyle === LAMBDA.single) {
      this.writeLine(
        `${lambda}_lambdaFn.addEnvironment("${envName}", ${value});`
      );
    } else if (lambdaStyle === LAMBDA.multiple) {

      this.writeLine(
        `${lambda}_lambdaFn_${functionName}.addEnvironment("${envName}", ${value});`
      );
    }
  }

  
  public initializeTestForLambdaWithDynamoDB(
    funcName: string,
    handlerName: string
  ) {
    this.writeLine(`expect(actual).to(
      haveResource("AWS::Lambda::Function", {
        FunctionName: "${funcName}",
        Handler: "${handlerName}.handler",
        Runtime: "nodejs12.x",
        Environment: {
          Variables: {
            TABLE_NAME: {
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
