import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import {
  APITYPE,
  CONSTRUCTS,
  DATABASE,
  LAMBDASTYLE,
  PATH,
} from "../../../utils/constant";
import { Cdk } from "../../../lib/Cdk";
import { Imports } from "../../../lib/ConstructsImports";
import { DynamoDB } from "../../../lib/DynamoDB";
import { dynamodbAccessHandler } from "./functions";
const model = require("../../../model.json");
const { database } = model.api;

if (database && database === DATABASE.dynamo) {
  Generator.generate(
    {
      outputFile: `${PATH.construct}${CONSTRUCTS.dynamodb}/index.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const { apiName } = model.api;
      const cdk = new Cdk(output);
      const imp = new Imports(output);
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
        },
      ];

      cdk.initializeConstruct(
        CONSTRUCTS.dynamodb,
        undefined,
        () => {
          dynamoDB.initializeDynamodb(apiName, output);
          ts.writeLine();
          ts.writeLine(`this.table = ${apiName}_table`);
          ts.writeLine();
        },
        output,
        undefined,
        properties
      );
    }
  );
}
