import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { Cdk } from "../../../lib/Cdk";
import { DynamoDB } from "../../../lib/DynamoDB";
import { DATABASE, PATH } from "../../../utils/constant";
import { Imports } from "../../../lib/ConstructsImports";
const model = require(`../../../../../model.json`);
const { USER_WORKING_DIRECTORY } = model;

if (model?.api?.database === DATABASE.dynamo) {
  Generator.generate(
    {
      outputFile: `${PATH.test}${USER_WORKING_DIRECTORY}-dynamodb.test.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const testClass = new Cdk(output);
      const dynodb = new DynamoDB(output);
      const imp = new Imports(output);
      imp.ImportsForTest(output, USER_WORKING_DIRECTORY, "pattern1");
      ts.writeLine();

      testClass.initializeTest(
        "Dynamodb Constructs Test",
        () => {
          ts.writeLine();
          dynodb.initializeTestForDynamodb(model?.api?.apiName);
        },
        output,
        USER_WORKING_DIRECTORY,
        "pattern_v1"
      );
    }
  );
}
