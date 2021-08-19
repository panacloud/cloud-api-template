import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, LAMBDA } from "../../../cloud-api-constants";
import { Cdk } from "../../../Constructs/Cdk";
import { Imports } from "../../../Constructs/ConstructsImports";
import { DynamoDB } from "../../../Constructs/DynamoDB";
const model = require("../../../model.json");
const { database,apiName } = model.api;

if (database && database === DATABASE.dynamoDb) {
  Generator.generate(
    {
      outputFile: `../../../../../lib/${CONSTRUCTS.dynamodb}/index.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const cdk = new Cdk(output);
      const imp = new Imports(output)
      const dynamoDB = new DynamoDB(output);
      imp.importsForStack(output);
      imp.importDynamodb(output);
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
