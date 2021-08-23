import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { TypeScriptWriter } from '@yellicode/typescript';
import { Iam } from '../../../Constructs/Iam';
import { Cdk } from '../../../Constructs/Cdk';
import { Lambda } from '../../../Constructs/Lambda';
import { CONSTRUCTS, DATABASE, LAMBDA } from '../../../cloud-api-constants';
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;

if (model?.api?.lambdaStyle) {
  Generator.generateFromModel(
    {
      outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-lambda.test.ts`,
    },
    (output: TextWriter, model: any) => {
      const ts = new TypeScriptWriter(output);
      const testClass = new Cdk(output);
      const iam = new Iam(output);
      const lambda = new Lambda(output);
      const cdk = new Cdk(output);
      const { apiName, lambdaStyle, database } = model.api;
      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      if (database && database === DATABASE.dynamoDb) {
        testClass.ImportsForTest(output, USER_WORKING_DIRECTORY);
        cdk.importForDynamodbConstruct(output);
        ts.writeLine();
        testClass.initializeTest(
          'Lambda Attach With Dynamodb Constructs Test',
          () => {
            ts.writeLine();
            iam.dynamodbConsturctIdentifier();
            ts.writeLine();
            iam.DynodbTableIdentifier();
            ts.writeLine();
            if (lambdaStyle === LAMBDA.single) {
              let funcName = `${apiName}Lambda`;
              lambda.initializeTestForLambdaWithDynamoDB(funcName, 'main');
              ts.writeLine();
            } else if (lambdaStyle === LAMBDA.multiple) {
              Object.keys(mutationsAndQueries).forEach((key) => {
                let funcName = `${apiName}Lambda${key}`;
                lambda.initializeTestForLambdaWithDynamoDB(funcName, key);
                ts.writeLine();
              });
            }
            iam.lambdaServiceRoleTest();
            ts.writeLine();
            if (lambdaStyle === LAMBDA.single) {
              iam.lambdaServiceRolePolicyTestForDynodb(1);
            } else if (lambdaStyle === LAMBDA.multiple) {
              iam.lambdaServiceRolePolicyTestForDynodb(
                Object.keys(mutationsAndQueries).length
              );
            }
            ts.writeLine();
          },
          output,
          USER_WORKING_DIRECTORY
        );
      } else if (database && database === DATABASE.neptuneDb){
          testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY)
          cdk.importForNeptuneConstruct
          ts.writeLine();
          testClass.initializeTest2("Lambda Attach With NeptuneDB Constructs Test", () => {
            ts.writeLine();
            ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct.VPCRef.isolatedSubnets;`)
            ts.writeLine()
            ts.writeLine(`const lambdaConstruct = new LambdaConstruct(stack, 'lambdaTestStack', {`)
            ts.writeLine(`VPCRef: vpc.VPCRef,`)
            ts.writeLine(`SGRef: vpc.SGRef,`)
            ts.writeLine(`neptuneReaderEndpoint: vpc.neptuneReaderEndpoint,`)
            ts.writeLine(`});`)
            ts.writeLine()
            ts.writeLine(`const cfn_cluster = vpc.node.children.filter(`)
            ts.writeLine(`(elem) => elem instanceof cdk.aws_neptune.CfnDBCluster`)
            ts.writeLine(`);`)
            ts.writeLine()
            if(lambdaStyle === LAMBDA.single){
              let funcName = `${apiName}Lambda`;
              lambda.initializeTestForLambdaWithNeptune(funcName, 'main')
            } else if(lambdaStyle === LAMBDA.multiple){
              Object.keys(mutationsAndQueries).forEach((key) => {
                let funcName = `${apiName}Lambda${key}`;
                lambda.initializeTestForLambdaWithNeptune(funcName, key)
                ts.writeLine()
              })
            }

          }, 
          output, 
          CONSTRUCTS.lambda)
      }
    }
  );
}
