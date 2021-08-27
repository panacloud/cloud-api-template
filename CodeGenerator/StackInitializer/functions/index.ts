import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { APITYPE, LAMBDASTYLE } from "../../../util/constant";
import { DynamoDB } from "../../../Constructs/DynamoDB";

export const lambdaEnvHandler = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDASTYLE,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output);
  let apiLambda = apiName + "Lambda";

  if (lambdaStyle === LAMBDASTYLE.single) {
    let lambdafunc = `${apiName}_lambdaFn`;
    ts.writeLine(
      `${apiLambda}.${lambdafunc}.addEnvironment("TABLE_NAME",${apiName}_table.tableName)`
    );
    ts.writeLine();
  }
  if (lambdaStyle === LAMBDASTYLE.multi) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      ts.writeLine(
        `${apiLambda}.${lambdafunc}.addEnvironment("TABLE_NAME",${apiName}_table.tableName)`
      );
      ts.writeLine();
    });
  }
};

export const lambdaPropsHandlerDynamodb = (
  output: TextWriter,
  dbConstructName: string
) => {
  const ts = new TypeScriptWriter(output);
  ts.writeLine(`tableName:${dbConstructName}.table.tableName`);
  ts.writeLine();
};

export const lambdaConstructPropsHandlerNeptunedb = (
  output: TextWriter,
  apiName: string
) => {
  const ts = new TypeScriptWriter(output);
  ts.writeLine(`SGRef:${apiName}_neptunedb.SGRef,`);
  ts.writeLine(`VPCRef:${apiName}_neptunedb.VPCRef,`);
  ts.writeLine(
    `neptuneReaderEndpoint:${apiName}_neptunedb.neptuneReaderEndpoint`
  );
};

export const lambdaConstructPropsHandlerAuroradb = (
  output: TextWriter,
  apiName: string
) => {
  const ts = new TypeScriptWriter(output);
  ts.writeLine(`secretRef:${apiName}_auroradb.secretRef,`);
  ts.writeLine(`vpcRef:${apiName}_auroradb.vpcRef,`);
  ts.writeLine(`serviceRole: ${apiName}_auroradb.serviceRole`);
};

export const propsHandlerForAppsyncConstructDynamodb = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDASTYLE,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle === LAMBDASTYLE.single) {
    let apiLambda = apiName + "Lambda";
    let lambdafunc = `${apiName}_lambdaFn`;
    ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn`);
  } else if (lambdaStyle === LAMBDASTYLE.multi) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      let apiLambda = `${apiName}Lambda`;
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      ts.writeLine(
        `${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn,`
      );
    });
  }
};

export const propsHandlerForAppsyncConstructNeptunedb = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDASTYLE,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle === LAMBDASTYLE.single) {
    let apiLambda = apiName + "Lambda";
    let lambdafunc = `${apiName}_lambdaFnArn`;
    ts.writeLine(`${lambdafunc} : ${apiLambda}.${lambdafunc}`);
  } else if (lambdaStyle === LAMBDASTYLE.multi) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      let apiLambda = `${apiName}Lambda`;
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}Arn,`);
    });
  }
};

export const LambdaAccessHandler = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDASTYLE,
  apiType:string,
  mutationsAndQueries: any
) => {
  const dynamodb = new DynamoDB(output);
  const ts = new TypeScriptWriter(output)
  if (lambdaStyle === LAMBDASTYLE.single || apiType === APITYPE.rest){
    dynamodb.dbConstructLambdaAccess(
      apiName,
      `${apiName}_table`,
      `${apiName}Lambda`,
      lambdaStyle,
      apiType
    );
    ts.writeLine()
  } else if (lambdaStyle === LAMBDASTYLE.multi && apiType === APITYPE.graphql) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      dynamodb.dbConstructLambdaAccess(
        apiName,
        `${apiName}_table`,
        `${apiName}Lambda`,
        lambdaStyle,
        apiType,
        key
      );
    });
    ts.writeLine()
  }
};

export const propsHandlerForApiGatewayConstruct = (
  output: TextWriter,
  apiName: string
) => {
  const ts = new TypeScriptWriter(output);
  let lambdafunc = `${apiName}_lambdaFn`;
  ts.writeLine(`${lambdafunc}: ${apiName}Lambda.${lambdafunc}`);
};

export const propsHandlerForDynamoDbConstruct = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDASTYLE,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output);

  if (lambdaStyle === LAMBDASTYLE.single) {
    let lambdafunc = `${apiName}_lambdaFn`;
    ts.writeLine(`${lambdafunc}: ${apiName}Lambda.${lambdafunc}`);
  } else if (lambdaStyle === LAMBDASTYLE.multi) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      ts.writeLine(`${lambdafunc} : ${apiName}Lambda.${lambdafunc},`);
    });
  }
};
