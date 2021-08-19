import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { DATABASE, LAMBDA } from "../../../../cloud-api-constants";
import { DynamoDB } from "../../../../Constructs/DynamoDB";

export const dynamodbAccessHandler = (apiName:string,output:TextWriter,lambdaStyle:LAMBDA,mutationsAndQueries:any)=>{
  const dynamoDB = new DynamoDB(output)
  const ts = new TypeScriptWriter(output)
  if (lambdaStyle === LAMBDA.single) {
    dynamoDB.grantFullAccess(
      `${apiName}`,
      `${apiName}_table`,
      lambdaStyle
    );
  } else if (lambdaStyle === LAMBDA.multiple) {
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
}

export const dynamodbPropsHandler = (apiName:string,output:TextWriter,lambdaStyle:LAMBDA,mutationsAndQueries:any) => {
  const ts = new TypeScriptWriter(output)
  if (lambdaStyle && lambdaStyle === LAMBDA.single) {
    const props = {
      name: `${apiName}_lambdaFn`,
      type: "lambda.Function",
    }
  }

  if (lambdaStyle && lambdaStyle === LAMBDA.multiple) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      const props = {
        name: `${apiName}_lambdaFn_${key}`,
        type: "lambda.Function",
      };
      ts.writeLine(`${props}`)
    });
  }
};
