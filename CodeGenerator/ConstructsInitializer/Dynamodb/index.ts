import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, LAMBDA } from "../../../cloud-api-constants";
import { Cdk } from "../../../Constructs/Cdk";
import { DynamoDB } from "../../../Constructs/DynamoDB";
import { Lambda } from "../../../Constructs/Lambda";
import { dynamodbAccessHandler, dynamodbPropsHandler } from "./functions";
const model = require("../../../model.json");
const { database } = model.api;

if (database && database === DATABASE.dynamoDb) {
  Generator.generateFromModel(
    {
      outputFile: `../../../../../lib/${CONSTRUCTS.dynamodb}/index.ts`,
    },
    (output: TextWriter, model: any) => {
      const ts = new TypeScriptWriter(output);
      const { apiName, lambdaStyle, database } = model.api;
      const mutations = model.type.Mutation ? model.type.Mutation : {};
      const queries = model.type.Query ? model.type.Query : {};
      const mutationsAndQueries = { ...mutations, ...queries };
      const cdk = new Cdk(output);
      const dynamoDB = new DynamoDB(output);
      const lambda = new Lambda(output);
      cdk.importsForStack(output);
      lambda.importLambda(output);
      dynamoDB.importDynamodb(output);
      ts.writeLine();
      
      let props = [{
        name: `${apiName}_lambdaFn`,
        type: "lambda.Function",       
      }]
    
      if (lambdaStyle && lambdaStyle === LAMBDA.multiple) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
           props[index] = {
            name: `${apiName}_lambdaFn_${key}`,
            type: "lambda.Function",
          };
        });
      }

      const properties: PropertyDefinition[] = [
        {
          name: "tableName",
          typeName: "string",
          accessModifier: "public",
          isReadonly: true,
        },
      ];

      cdk.initializeConstruct(
        CONSTRUCTS.dynamodb,
        "dbProps",
        () => {
          dynamoDB.initializeDynamodb(apiName, output);
          ts.writeLine();
          dynamodbAccessHandler(apiName,output);
          ts.writeLine();
        },
        output,
        props,
        properties
      );
    }
  );
}
