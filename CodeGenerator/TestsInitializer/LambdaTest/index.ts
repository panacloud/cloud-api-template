import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Iam } from "../../../Constructs/Iam";
import { Cdk } from "../../../Constructs/Cdk";
import { Lambda } from "../../../Constructs/Lambda";
import { APITYPE, DATABASE, LAMBDASTYLE, PATH } from "../../../constant";
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
      const imp = new Imports(output)
      const { apiName, lambdaStyle,database ,apiType} = model.api;
      let mutations = {};
      let queries = {};
      if (apiType === APITYPE.graphql) {
        mutations = model.type.Mutation ? model.type.Mutation : {};
        queries = model.type.Query ? model.type.Query : {};
      }
      const mutationsAndQueries = { ...mutations, ...queries };      
      imp.ImportsForTest(output,USER_WORKING_DIRECTORY);
      if(database === DATABASE.dynamo){
        imp.importForDynamodbConstructInTest(output)
        ts.writeLine();  
      }
      cdk.initializeTest(
        "Lambda Attach With Dynamodb Constructs Test",
        () => {
          ts.writeLine();
          if(database === DATABASE.dynamo){
            if(apiType === APITYPE.rest || (lambdaStyle === LAMBDASTYLE.single && apiType ===APITYPE.graphql)){
              let funcName = `${apiName}Lambda`;
              iam.dynamodbConsturctIdentifier()
              ts.writeLine();
              iam.DynodbTableIdentifier();
              ts.writeLine();  
              lambda.initializeTestForLambdaWithDynamoDB(funcName, "main");
              ts.writeLine();
            }else if (lambdaStyle === LAMBDASTYLE.multi) {
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
  );

