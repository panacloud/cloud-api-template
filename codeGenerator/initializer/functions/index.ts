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

export const lambdaConstructPropsHandlerNeptunedb=(output:TextWriter,apiName:string)=>{
  const ts = new TypeScriptWriter(output)
  ts.writeLine(`SGRef:${apiName}_neptunedb.SGRef,`)
  ts.writeLine(`VPCRef:${apiName}_neptunedb.VPCRef,`)
  ts.writeLine(`neptuneReaderEndpoint:${apiName}_neptunedb.neptuneReaderEndpoint`)
}

export const lambdaConstructPropsHandlerAuroradb=(output:TextWriter,apiName:string)=>{
  const ts = new TypeScriptWriter(output)
  ts.writeLine(`secretRef:${apiName}_auroradb.secretRef,`)
  ts.writeLine(`VPCRef:${apiName}_auroradb.vpcRef,`)
  ts.writeLine(`serviceRole: ${apiName}_auroradb.serviceRole`)
}

export const propsHandlerForAppsyncConstructDynamodb = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDA,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output)
  if (lambdaStyle === LAMBDA.single) {
    let apiLambda = apiName + "Lambda";
    let lambdafunc = `${apiName}_lambdaFn`;
    ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn`)        
  } else if (lambdaStyle === LAMBDA.multiple) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      let apiLambda = `${apiName}Lambda`;
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}.functionArn,`)
    });
  }
};

export const propsHandlerForAppsyncConstructNeptunedb = (
  output: TextWriter,
  apiName: string,
  lambdaStyle: LAMBDA,
  mutationsAndQueries: any
) => {
  const ts = new TypeScriptWriter(output)
  if (lambdaStyle === LAMBDA.single) {
    let apiLambda = apiName + "Lambda";
    let lambdafunc = `${apiName}_lambdaFnArn`;
    ts.writeLine(`${lambdafunc} : ${apiLambda}.${lambdafunc}`)        
  } else if (lambdaStyle === LAMBDA.multiple) {
    Object.keys(mutationsAndQueries).forEach((key) => {
      let apiLambda = `${apiName}Lambda`;
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      ts.writeLine(`${lambdafunc}Arn : ${apiLambda}.${lambdafunc}Arn,`)
    });
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
    ts.writeLine(`${lambdafunc}: ${apiName}Lambda.${lambdafunc}`)
    
  } else if (lambdaStyle === LAMBDA.multiple) {
    // var dbProps: { [k: string]: string } = {};
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      let lambdafunc = `${apiName}_lambdaFn_${key}`;
      ts.writeLine(`${lambdafunc} : ${apiName}Lambda.${lambdafunc},`)
    });
    // return dbProps
}
}
