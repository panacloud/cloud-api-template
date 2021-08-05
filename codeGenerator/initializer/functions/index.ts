import { TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";
import { LAMBDA } from "../../../cloud-api-constants";

export const lambdaEnvHandler = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDA,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output);
  let apiLambda = apiName + "Lambda";

  if (lambdaStyle === LAMBDA.single) {
    let lambdafunc = `${apiName}_lambdaFn`;
    ts.writeLine(
      `${apiLambda}.${lambdafunc}.addEnvironment("TABLE_NAME",${apiName}_table.tableName)`
    );
    ts.writeLine();
  }
  if (lambdaStyle === LAMBDA.multiple) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      ts.writeLine(
        `${apiLambda}.${lambdafunc}.addEnvironment("TABLE_NAME",${apiName}_table.tableName)`
      );
      ts.writeLine();
    });
  }
};

export const propsHandlerForAppsyncConstruct = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDA,
  mutationsAndQueries: any
) => {
  if (lambdaStyle === LAMBDA.single) {
    let apiLambda = apiName + "Lambda";
    let lambdafunc = `${apiName}_lambdaFn`;
    return `{
          ${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn
        }`;
  } else if (lambdaStyle === LAMBDA.multiple) {
    let appsyncProps: { [k: string]: any } = {};
    Object.keys(mutationsAndQueries).forEach((key) => {
      let apiLambda = `${apiName}Lambda`;
      let lambdafunc = `${apiName}_lambdaFn_${key}Arn`;
      appsyncProps[lambdafunc] = `${apiLambda}.${lambdafunc}.functionArn,`;
    });
    return appsyncProps;
  }
};

export const propsHandlerForDynoDbConstruct = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDA,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output);

  if (lambdaStyle === LAMBDA.single) {
    let lambdafunc = `${apiName}_lambdaFn`;
    return `{
      ${lambdafunc}: ${apiName}Lambda.${lambdafunc}
    }`;
  } else if (lambdaStyle === LAMBDA.multiple) {
    var dbProps: { [k: string]: any } = {};
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      dbProps[lambdafunc] = `${apiName}Lambda.${lambdafunc},`;
    });
    return dbProps;
  }
};
