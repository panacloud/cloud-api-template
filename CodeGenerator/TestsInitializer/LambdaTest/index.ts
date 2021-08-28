// import { TextWriter } from '@yellicode/core';
// import { Generator } from '@yellicode/templating';
// import { TypeScriptWriter } from '@yellicode/typescript';
// import { Iam } from '../../../Constructs/Iam';
// import { Cdk } from '../../../Constructs/Cdk';
// import { Lambda } from '../../../Constructs/Lambda';
// import { CONSTRUCTS, DATABASE, LAMBDA } from '../../../cloud-api-constants';
import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Iam } from "../../../Constructs/Iam";
import { Cdk } from "../../../Constructs/Cdk";
import { Lambda } from "../../../Constructs/Lambda";
import { APITYPE, DATABASE, LAMBDASTYLE, PATH, CONSTRUCTS } from "../../../constant";
import { Imports } from "../../../Constructs/ConstructsImports";
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;

Generator.generate(
    {
      outputFile: `${PATH.test}${USER_WORKING_DIRECTORY}-lambda.test.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const cdk = new Cdk(output);
      const iam = new Iam(output);
      const lambda = new Lambda(output);
      const { apiName, lambdaStyle, database, apiType } = model.api;
      const imp = new Imports(output)
      let mutations = {};
      let queries = {};
      if (apiType === APITYPE.graphql) {
        mutations = model.type.Mutation ? model.type.Mutation : {};
        queries = model.type.Query ? model.type.Query : {};
      }
      const mutationsAndQueries = { ...mutations, ...queries };      
      // imp.ImportsForTest(output,USER_WORKING_DIRECTORY);

      // if (database && database === DATABASE.dynamoDb) {
        //   testClass.ImportsForTest(output, USER_WORKING_DIRECTORY);
        //   cdk.importForDynamodbConstruct(output);
        // const { apiName, lambdaStyle, database ,apiType } = model.api;
        if(database === DATABASE.dynamo){
          imp.ImportsForTest(output,USER_WORKING_DIRECTORY);
          imp.importForDynamodbConstructInTest(output)
          ts.writeLine();  
        
        cdk.initializeTest(
          "Lambda Attach With Dynamodb Constructs Test",
          () => {
            ts.writeLine();
            if(database === DATABASE.dynamo){
              if (apiType === APITYPE.rest || (lambdaStyle === LAMBDASTYLE.single && apiType ===APITYPE.graphql)) {
                let funcName = `${apiName}Lambda`;
                iam.dynamodbConsturctIdentifier()
                ts.writeLine();
                iam.DynodbTableIdentifier();
                ts.writeLine();  
                lambda.initializeTestForLambdaWithDynamoDB(funcName, "main");
                ts.writeLine();
              } else if (lambdaStyle === LAMBDASTYLE.multi) {
                  iam.dynamodbConsturctIdentifier()
                  ts.writeLine();
                  iam.DynodbTableIdentifier();
                  ts.writeLine();  
                  Object.keys(mutationsAndQueries).forEach((key) => {
                    let funcName = `${apiName}Lambda${key}`;
                    lambda.initializeTestForLambdaWithDynamoDB(funcName, key);
                    ts.writeLine();
                  });
              }
            }
            iam.lambdaServiceRoleTest();
            ts.writeLine();
            if(apiType === APITYPE.graphql){
              if (lambdaStyle === LAMBDASTYLE.single && database === DATABASE.dynamo) {
                iam.lambdaServiceRolePolicyTestForDynodb(1);
              } else if (lambdaStyle === LAMBDASTYLE.multi && database === DATABASE.dynamo) {
                iam.lambdaServiceRolePolicyTestForDynodb(
                  Object.keys(mutationsAndQueries).length
                );
              }  
            } else if(apiType===APITYPE.rest && database === DATABASE.dynamo){
              iam.lambdaServiceRolePolicyTestForDynodb(1);
            }
            ts.writeLine();
          },
          output,
          USER_WORKING_DIRECTORY
        ); 
      }
       else if (database === DATABASE.neptune) {
        imp.ImportsForTest(output,USER_WORKING_DIRECTORY);
          imp.importForNeptuneConstructInTest(output)
          imp.importForLambdaConstructInTest(output)
          ts.writeLine();  
        
      // } else if (database && database === DATABASE.neptuneDb){
      //     cdk.ImportsForTest2(output, USER_WORKING_DIRECTORY)
      //     cdk.importForLambdaConstruct(output)
      //     cdk.importForNeptuneConstruct(output)
      //     ts.writeLine();
          cdk.initializeTest2("Lambda Attach With NeptuneDB Constructs Test", () => {
            ts.writeLine();
            ts.writeLine(`const isolated_subnets = VpcNeptuneConstruct_stack.VPCRef.isolatedSubnets;`)
            ts.writeLine()
            ts.writeLine(`const LambdaConstruct_stack = new LambdaConstruct(stack, 'LambdaConstructTest', {`)
            ts.writeLine(`VPCRef: VpcNeptuneConstruct_stack.VPCRef,`)
            ts.writeLine(`SGRef: VpcNeptuneConstruct_stack.SGRef,`)
            ts.writeLine(`neptuneReaderEndpoint: VpcNeptuneConstruct_stack.neptuneReaderEndpoint,`)
            ts.writeLine(`});`)
            ts.writeLine()
            ts.writeLine(`const cfn_cluster = VpcNeptuneConstruct_stack.node.children.filter(`)
            ts.writeLine(`(elem) => elem instanceof cdk.aws_neptune.CfnDBCluster`)
            ts.writeLine(`);`)
            ts.writeLine()
            if (apiType === APITYPE.rest || (lambdaStyle === LAMBDASTYLE.single && apiType === APITYPE.graphql)) {
                let funcName = `${apiName}Lambda`;
                lambda.initializeTestForLambdaWithNeptune(funcName, 'main')
              } else if (lambdaStyle === LAMBDASTYLE.multi) {
                Object.keys(mutationsAndQueries).forEach((key) => {
                  let funcName = `${apiName}Lambda${key}`;
                  lambda.initializeTestForLambdaWithNeptune(funcName, key)
                  ts.writeLine()                 
                })

              }
          }, 
          output, 
          CONSTRUCTS.neptuneDb)
        } else if (database === DATABASE.aurora) {
          imp.ImportsForTest(output,USER_WORKING_DIRECTORY);
          imp.importForAuroraDbConstructInTest(output)
          imp.importForLambdaConstructInTest(output)
          ts.writeLine();  
          cdk.initializeTest2("Lambda Attach With NeptuneDB Constructs Test", () => {
            //     ts.writeLine(`const LambdaConstruct_stack = new LambdaConstruct(stack, 'LambdaConstructTest', {`)
            //     ts.writeLine(`vpcRef: AuroraDbConstruct_stack.vpcRef,`)
            //     ts.writeLine(`secretRef: AuroraDbConstruct_stack.secretRef,`)
            //     ts.writeLine(`serviceRole: AuroraDbConstruct_stack.serviceRole,`)
            //     ts.writeLine(`});`)
            //     ts.writeLine()
            //     iam.serverlessClusterIdentifier()
            //     ts.writeLine()
            //     iam.secretIdentifier()
            //     ts.writeLine()
            //     iam.secretAttachment()
            //     ts.writeLine()
            if (apiType === APITYPE.rest || (lambdaStyle === LAMBDASTYLE.single && apiType === APITYPE.graphql)) {
              let funcName = `${apiName}Lambda`;
              lambda.initializeTestForLambdaWithAuroradb(funcName, 'main')
            } else if (lambdaStyle === LAMBDASTYLE.multi) {
              Object.keys(mutationsAndQueries).forEach((key) => {
                let funcName = `${apiName}Lambda${key}`;
                lambda.initializeTestForLambdaWithAuroradb(funcName, key)
                ts.writeLine()                 
              })
            }
          }, output, CONSTRUCTS.auroradb)          
        }
      // } else if (database && database === DATABASE.auroraDb) {
      //   testClass.ImportsForTest2(output, USER_WORKING_DIRECTORY)
      //   cdk.importForLambdaConstruct(output)
      //   cdk.importForAuroradbConstruct(output)
      //   ts.writeLine();
      //   testClass.initializeTest2('Lambda Attach With AuororaDB Constructs Test', () => {
      //     if(lambdaStyle === LAMBDA.single){
      //       let funcName = `${apiName}Lambda`;
      //       lambda.initializeTestForLambdaWithAuroradb(funcName, 'main')
      //     } else if(lambdaStyle === LAMBDA.multiple){
      //       Object.keys(mutationsAndQueries).forEach((key) => {
      //         let funcName = `${apiName}Lambda${key}`;
      //         lambda.initializeTestForLambdaWithAuroradb(funcName, key)
      //         ts.writeLine()
      //       })
      //     }
      //   }, output, CONSTRUCTS.auroradb)
      // }
    }
  );



        // ts.writeLine();
      //   testClass.initializeTest(
      //     'Lambda Attach With Dynamodb Constructs Test',
      //     () => {
      //       ts.writeLine();
      //       iam.dynamodbConsturctIdentifier();
      //       ts.writeLine();
      //       iam.DynodbTableIdentifier();
      //       ts.writeLine();
      //       if (lambdaStyle === LAMBDA.single) {
      //         let funcName = `${apiName}Lambda`;
      //         lambda.initializeTestForLambdaWithDynamoDB(funcName, 'main');
      //         ts.writeLine();
      //       } else if (lambdaStyle === LAMBDA.multiple) {
      //         Object.keys(mutationsAndQueries).forEach((key) => {
      //           let funcName = `${apiName}Lambda${key}`;
      //           lambda.initializeTestForLambdaWithDynamoDB(funcName, key);
      //           ts.writeLine();
      //         });
      //       }
      //       iam.lambdaServiceRoleTest();
      //       ts.writeLine();
      //       if (lambdaStyle === LAMBDA.single) {
      //         iam.lambdaServiceRolePolicyTestForDynodb(1);
      //       } else if (lambdaStyle === LAMBDA.multiple) {
      //         iam.lambdaServiceRolePolicyTestForDynodb(
      //           Object.keys(mutationsAndQueries).length
      //         );
      //       }
      //       ts.writeLine();
      //     },
      //     output,
      //     USER_WORKING_DIRECTORY
      //   );