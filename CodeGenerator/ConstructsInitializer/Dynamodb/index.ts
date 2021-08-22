import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import {
  APITYPE,
  CONSTRUCTS,
  DATABASE,
  LAMBDASTYLE,
  PATH,
} from "../../../constant";
import { Cdk } from "../../../Constructs/Cdk";
import { DynamoDB } from "../../../Constructs/DynamoDB";
import { dynamodbAccessHandler } from "./functions";
const model = require("../../../model.json");
const { database } = model.api;

if (database && database === DATABASE.dynamo) {
  Generator.generate(
    {
      outputFile: `${PATH.lib}${CONSTRUCTS.dynamodb}/index.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const { apiName, lambdaStyle, apiType } = model.api;

      let mutations = {};
      let queries = {};
      if (apiType === APITYPE.graphql) {
        mutations = model.type.Mutation ? model.type.Mutation : {};
        queries = model.type.Query ? model.type.Query : {};
      }
      const mutationsAndQueries = { ...mutations, ...queries };
      const cdk = new Cdk(output);
      const dynamoDB = new DynamoDB(output);
      cdk.importsForStack(output);
      dynamoDB.importDynamodb(output);
      ts.writeLine();

      let props = [
        {
          name: `${apiName}_lambdaFn`,
          type: "lambda.Function",
        },
      ];

      if (lambdaStyle && lambdaStyle === LAMBDASTYLE.multi) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
          props[index] = {
            name: `${apiName}_lambdaFn_${key}`,
            type: "lambda.Function",
          };
        });
      }

      const properties: PropertyDefinition[] = [
        {
          name: "table",
          typeName: "dynamodb.Table",
          accessModifier: "public",
          isReadonly: true,
        },
      ];

      cdk.initializeConstruct(
        CONSTRUCTS.dynamodb,
        undefined,
        () => {
          dynamoDB.initializeDynamodb(apiName, output);
          ts.writeLine();
          dynamodbAccessHandler(apiName, output);
          ts.writeLine();
        },
        output,
        undefined,
        properties
      );
    }
  );
}
