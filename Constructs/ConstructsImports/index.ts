import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS } from "../../constant";

export class Imports extends CodeWriter {
  
  public importsForStack(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
    ts.writeImports("constructs", ["Construct"]);
  }

  public importAppsync(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_appsync as appsync"]);
  }

  public importDynamodb(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_dynamodb as dynamodb"]);
  }

  public importRds(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_rds as rds"]);
  }

  public importIam(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_iam as iam"]);
  }

  public importLambda(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_lambda as lambda"]);
  }
  
  public importNeptune(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_neptune as neptune"]);
  }

  public importApiManager(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("panacloud-manager", ["PanacloudManager"]);
  }


  public importsForTags(output: TextWriter){
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["Tags"]);
  }

  public importEc2(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["aws_ec2 as ec2"]);
  }

  public importForAppsyncConstruct(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports(`./${CONSTRUCTS.appsync}`, [CONSTRUCTS.appsync]);
  }

  public importForApiGatewayConstruct(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports(`./${CONSTRUCTS.apigateway}`, [CONSTRUCTS.apigateway]);
  }

  public importAxios(){
    this.writeLine(`var axios = require('axios')`)
  }

  public importForDynamodbConstruct(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports(`./${CONSTRUCTS.dynamodb}`, [CONSTRUCTS.dynamodb]);
  }

  
  public importForLambdaConstruct(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports(`./${CONSTRUCTS.lambda}`, [CONSTRUCTS.lambda]);
  }

  public importForNeptuneConstruct(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports(`./${CONSTRUCTS.neptuneDb}`, [CONSTRUCTS.neptuneDb]);
}

  public importForAuroraDbConstruct(output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports(`./${CONSTRUCTS.auroradb}`, [CONSTRUCTS.auroradb]);
}

public importForAppsyncConstructInTest(output: TextWriter) {
  const ts = new TypeScriptWriter(output);
  ts.writeImports(`../lib/${CONSTRUCTS.appsync}`, [CONSTRUCTS.appsync]);
}

public importForDynamodbConstructInTest(output: TextWriter) {
  const ts = new TypeScriptWriter(output);
  ts.writeImports(`../lib/${CONSTRUCTS.dynamodb}`, [CONSTRUCTS.dynamodb]);
}


public importForLambdaConstructInTest(output: TextWriter) {
  const ts = new TypeScriptWriter(output);
  ts.writeImports(`../lib/${CONSTRUCTS.lambda}`, [CONSTRUCTS.lambda]);
}

public importForNeptuneConstructInTest(output: TextWriter) {
  const ts = new TypeScriptWriter(output);
  ts.writeImports(`../lib/${CONSTRUCTS.neptuneDb}`, [CONSTRUCTS.neptuneDb]);
}

public importForAuroraDbConstructInTest(output: TextWriter) {
  const ts = new TypeScriptWriter(output);
  ts.writeImports(`../lib/${CONSTRUCTS.auroradb}`, [CONSTRUCTS.auroradb]);
}


  public ImportsForTest(output: TextWriter,workingDir:string, pattern: string) {
    const ts = new TypeScriptWriter(output);
    if (pattern === 'pattern1') {
      ts.writeImports("aws-cdk-lib", "cdk");
      ts.writeImports("@aws-cdk/assert", [
        "countResources",
        "haveResource",
        "expect",
        "countResourcesLike",
      ]);
      ts.writeImports(`../lib/${workingDir}-stack`, workingDir);
    } else if(pattern === 'pattern2') {
      ts.writeImports('aws-cdk-lib', 'cdk');
      ts.writeLine(`import "@aws-cdk/assert/jest"`);
    }
  }
}
