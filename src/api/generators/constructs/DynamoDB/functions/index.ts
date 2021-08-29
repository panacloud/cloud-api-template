import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { APITYPE, LAMBDASTYLE } from "../../../../utils/constant";
import { DynamoDB } from "../../../../lib/DynamoDB";

export const dynamodbAccessHandler = (
  apiName: string,
  output: TextWriter,
  lambdaStyle: string,
  mutationsAndQueries: any
) => {
  const dynamoDB = new DynamoDB(output);
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle === LAMBDASTYLE.single) {
    dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle);
  } else if (lambdaStyle === LAMBDASTYLE.multi) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      dynamoDB.grantFullAccess(
        `${apiName}`,
        `${apiName}_table`,
        lambdaStyle,
        key
      );
      ts.writeLine();
    });
  }
};

export const dynamodbPropsHandler = (
  apiName: string,
  output: TextWriter,
  lambdaStyle: string,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle && lambdaStyle === LAMBDASTYLE.single) {
    const props = {
      name: `${apiName}_lambdaFn`,
      type: "lambda.Function",
    };
  }

  if (lambdaStyle && lambdaStyle === LAMBDASTYLE.multi) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      const props = {
        name: `${apiName}_lambdaFn_${key}`,
        type: "lambda.Function",
      };
      ts.writeLine(`${props}`);
    });
  }
};
