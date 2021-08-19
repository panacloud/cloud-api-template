import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Iam } from "../../../Constructs/Iam";
import { Cdk } from "../../../Constructs/Cdk";
import { Lambda } from "../../../Constructs/Lambda";
import { LAMBDA } from "../../../cloud-api-constants";
import { Imports } from "../../../Constructs/ConstructsImports";
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;

if (model?.api?.lambdaStyle) {
  Generator.generate(
    {
      outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-lambda.test.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const cdk = new Cdk(output);
      const iam = new Iam(output);
      const lambda = new Lambda(output);
      const imp = new Imports(output)
      const { apiName, lambdaStyle } = model.api;
      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      imp.ImportsForTest(output,USER_WORKING_DIRECTORY);
      imp.importForDynamodbConstruct(output)
      ts.writeLine();
      cdk.initializeTest(
        "Lambda Attach With Dynamodb Constructs Test",
        () => {
          ts.writeLine();
          iam.dynamodbConsturctIdentifier()
          ts.writeLine();
          iam.DynodbTableIdentifier();
          ts.writeLine();
          if (lambdaStyle === LAMBDA.single) {
            let funcName = `${apiName}Lambda`;
            lambda.initializeTestForLambdaWithDynamoDB(funcName, "main");
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
    }
  );
}
