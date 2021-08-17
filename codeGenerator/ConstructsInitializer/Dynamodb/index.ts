import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, LAMBDA } from "../../../cloud-api-constants";
import { Cdk } from "../../../Constructs/Cdk";
import { DynamoDB } from "../../../Constructs/DynamoDB";
const model = require("../../../model.json");
const { database } = model.api;

if (database && database === DATABASE.dynamoDb) {
  Generator.generateFromModel(
    {
      outputFile: `../../../../../lib/${CONSTRUCTS.dynamodb}/index.ts`,
    },
    (output: TextWriter, model: any) => {
      const ts = new TypeScriptWriter(output);
      const {apiName} = model.api;
      const cdk = new Cdk(output);
      const dynamoDB = new DynamoDB(output);
      cdk.importsForStack(output);
      dynamoDB.importDynamodb(output);
      ts.writeLine();
      
      const properties: PropertyDefinition[] = [
        {
          name: "table",
          typeName: "dynamodb.Table",
          accessModifier: "public",
          isReadonly: true,
        }
      ];

      cdk.initializeConstruct(
        CONSTRUCTS.dynamodb,
        undefined,
        () => {
          dynamoDB.initializeDynamodb(apiName, output);
          ts.writeLine();
          ts.writeLine(`this.table = ${apiName}_table`)
        },
        output,
        undefined,
        properties
      );
    }
  );
}
