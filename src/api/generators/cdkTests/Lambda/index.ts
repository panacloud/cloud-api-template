import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Iam } from "../../../lib/Iam";
import { Cdk } from "../../../lib/Cdk";
import { Lambda } from "../../../lib/Lambda";
import {
  APITYPE,
  DATABASE,
  LAMBDASTYLE,
  PATH,
  CONSTRUCTS,
} from "../../../utils/constant";
import { Imports } from "../../../lib/ConstructsImports";
import {
  lambdaWithAuroraFunction,
  lambdaWithNeptuneFunction,
} from "./functions";
const model = require(`../../../../../model.json`);
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
    const imp = new Imports(output);
    let mutations = {};
    let queries = {};
    if (apiType === APITYPE.graphql) {
      mutations = model.type.Mutation ? model.type.Mutation : {};
      queries = model.type.Query ? model.type.Query : {};
    }
    const mutationsAndQueries = { ...mutations, ...queries };
    if (database === DATABASE.dynamo) {
      imp.ImportsForTest(output, USER_WORKING_DIRECTORY, "pattern1");
      imp.importForDynamodbConstructInTest(output);
      ts.writeLine();
      cdk.initializeTest(
        "Lambda Attach With Dynamodb Constructs Test",
        () => {
          ts.writeLine();
          if (database === DATABASE.dynamo) {
            if (
              apiType === APITYPE.rest ||
              (lambdaStyle === LAMBDASTYLE.single &&
                apiType === APITYPE.graphql)
            ) {
              let funcName = `${apiName}Lambda`;
              iam.dynamodbConsturctIdentifier();
              ts.writeLine();
              iam.DynodbTableIdentifier();
              ts.writeLine();
              lambda.initializeTestForLambdaWithDynamoDB(funcName, "main");
              ts.writeLine();
            } else if (lambdaStyle === LAMBDASTYLE.multi) {
              iam.dynamodbConsturctIdentifier();
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
          if (apiType === APITYPE.graphql) {
            if (
              lambdaStyle === LAMBDASTYLE.single &&
              database === DATABASE.dynamo
            ) {
              iam.lambdaServiceRolePolicyTestForDynodb(1);
            } else if (
              lambdaStyle === LAMBDASTYLE.multi &&
              database === DATABASE.dynamo
            ) {
              iam.lambdaServiceRolePolicyTestForDynodb(
                Object.keys(mutationsAndQueries).length
              );
            }
          } else if (apiType === APITYPE.rest && database === DATABASE.dynamo) {
            iam.lambdaServiceRolePolicyTestForDynodb(1);
          }
          ts.writeLine();
        },
        output,
        USER_WORKING_DIRECTORY,
        "pattern_v1"
      );
    } else if (database === DATABASE.neptune) {
      imp.ImportsForTest(output, USER_WORKING_DIRECTORY, "pattern2");
      imp.importForNeptuneConstructInTest(output);
      imp.importForLambdaConstructInTest(output);
      ts.writeLine();
      cdk.initializeTest(
        "Lambda Attach With NeptuneDB Constructs Test",
        () => {
          ts.writeLine();
          iam.constructorIdentifier(CONSTRUCTS.neptuneDb);
          ts.writeLine();
          lambdaWithNeptuneFunction(output);
          ts.writeLine();
          if (
            apiType === APITYPE.rest ||
            (lambdaStyle === LAMBDASTYLE.single && apiType === APITYPE.graphql)
          ) {
            let funcName = `${apiName}Lambda`;
            lambda.initializeTestForLambdaWithNeptune(funcName, "main");
          } else if (lambdaStyle === LAMBDASTYLE.multi) {
            Object.keys(mutationsAndQueries).forEach((key) => {
              let funcName = `${apiName}Lambda${key}`;
              lambda.initializeTestForLambdaWithNeptune(funcName, key);
              ts.writeLine();
            });
          }
        },
        output,
        USER_WORKING_DIRECTORY,
        "pattern_v2"
      );
    } else if (database === DATABASE.aurora) {
      imp.ImportsForTest(output, USER_WORKING_DIRECTORY, "pattern2");
      imp.importForAuroraDbConstructInTest(output);
      imp.importForLambdaConstructInTest(output);
      ts.writeLine();
      cdk.initializeTest(
        "Lambda Attach With Aurora Constructs Test",
        () => {
          ts.writeLine();
          iam.constructorIdentifier(CONSTRUCTS.auroradb);
          ts.writeLine();
          lambdaWithAuroraFunction(output);
          ts.writeLine();
          iam.serverlessClusterIdentifier();
          ts.writeLine();
          iam.secretIdentifier();
          ts.writeLine();
          iam.secretAttachment();
          ts.writeLine();
          if (
            apiType === APITYPE.rest ||
            (lambdaStyle === LAMBDASTYLE.single && apiType === APITYPE.graphql)
          ) {
            let funcName = `${apiName}Lambda`;
            lambda.initializeTestForLambdaWithAuroradb(funcName, "main");
          } else if (lambdaStyle === LAMBDASTYLE.multi) {
            Object.keys(mutationsAndQueries).forEach((key) => {
              let funcName = `${apiName}Lambda${key}`;
              lambda.initializeTestForLambdaWithAuroradb(funcName, key);
              ts.writeLine();
            });
          }
        },
        output,
        USER_WORKING_DIRECTORY,
        "pattern_v2"
      );
    }
  }
);
