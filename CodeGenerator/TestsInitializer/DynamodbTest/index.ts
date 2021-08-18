import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Cdk } from "../../../Constructs/Cdk";
import { DynamoDB } from "../../../Constructs/dynamoDB";
import { DATABASE } from "../../../cloud-api-constants";
const model = require(`../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;

if (model?.api?.database === DATABASE.dynamoDb) {
  Generator.generate(
    {
      outputFile: `../../../../../test/${USER_WORKING_DIRECTORY}-dynamodb.test.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const testClass = new Cdk(output);
      const dynodb = new DynamoDB(output);
      testClass.ImportsForTest(output,USER_WORKING_DIRECTORY);
      ts.writeLine();
      testClass.initializeTest(
        "Dynamodb Constructs Test",
        () => {
          ts.writeLine();
          dynodb.initializeTestForDynamodb(model?.api?.apiName);
        },
        output,
        USER_WORKING_DIRECTORY
      );
    }
  );
}
