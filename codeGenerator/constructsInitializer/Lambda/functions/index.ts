import { TextWriter } from "@yellicode/core";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import { DATABASE, LAMBDA } from "../../../../cloud-api-constants";
import { Lambda } from "../../../../Constructs/Lambda";
const model = require("../../../../model.json");
const { apiName, lambdaStyle, database } = model.api;

const mutations = model.type.Mutation ? model.type.Mutation : {};
const queries = model.type.Query ? model.type.Query : {};

const mutationsAndQueries = {
  ...mutations,
  ...queries,
};

export const lambdaPropsHandlerForNeptunedb=()=>{
  let props : { name: string,type:string}[]
  return props = [{
    name :"VPCRef",
    type:"ec2.Vpc"
  },{
    name :"SGRef",
    type:"SecurityGroup"
  },{
    name :"neptuneReaderEndpoint",
    type:"string"
  }]
}

export const lambdaHandlerForNeptunedb = (output: TextWriter,lambdaStyle:LAMBDA,dataBase:DATABASE) => {
  const lambda = new Lambda(output);
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle === LAMBDA.single) {
    if (database === DATABASE.neptuneDb) {
      lambda.initializeLambda(
        apiName,
        output,
        lambdaStyle,
        undefined,
        `props!.VPCRef`,
        `props!.SGRef`,
        [
          {
            name: "NEPTUNE_ENDPOINT",
            value: `props!.neptuneReaderEndpoint`,
          },
        ],
        `ec2.SubnetType.ISOLATED`
      );
      ts.writeLine();
      ts.writeLine(`this.${apiName}_lambdaFnArn = ${apiName}_lambdaFn.functionArn`);
      ts.writeLine()
    }
  } else if (lambdaStyle === LAMBDA.multiple) {
    if (database === DATABASE.neptuneDb) {
      Object.keys(mutationsAndQueries).forEach((key) => {
        lambda.initializeLambda(
          apiName,
          output,
          lambdaStyle,
          key,
          `props!.VPCRef`,
          `props!.SGRef`,
            [
            {
              name: "NEPTUNE_ENDPOINT",
              value: `props!.neptuneReaderEndpoint`,
            },
          ],
          `ec2.SubnetType.ISOLATED`
        );
        ts.writeLine();
        ts.writeLine(`this.${apiName}_lambdaFn_${key}Arn = ${apiName}_lambdaFn_${key}Arn.functionArn`);
        ts.writeLine()
    })
  } else {
    ts.writeLine();
  }
};
}

export const lambdaProperiesHandlerForNeptuneDb = (output: TextWriter) => {
  
  let properties: PropertyDefinition[] = [
    {
      name: `${apiName}_lambdaFnArn`,
      typeName: "string",
      accessModifier: "public",
    },
  ];
  if (lambdaStyle === LAMBDA.single && database === DATABASE.neptuneDb) {
    properties = [
      {
        name: `${apiName}_lambdaFnArn`,
        typeName: "string",
        accessModifier: "public",
        isReadonly:true
      },
    ];
    return properties;
  } else if (lambdaStyle === LAMBDA.multiple && database === DATABASE.neptuneDb) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      properties[index] = {
        name: `${apiName}_lambdaFn_${key}Arn`,
        typeName: "string",
        accessModifier: "public",
        isReadonly:true
      };
    });
    return properties
  }
};

export const lambdaProperiesHandlerForDynoDb = (output: TextWriter) => {
  let properties: PropertyDefinition[] = [
    {
      name: `${apiName}_lambdaFn`,
      typeName: "lambda.Function",
      accessModifier: "public",
    },
  ];
  if (lambdaStyle === LAMBDA.single) {
    properties = [
      {
        name: `${apiName}_lambdaFn`,
        typeName: "lambda.Function",
        accessModifier: "public",
      },
    ];
    return properties;
  } else if (lambdaStyle === LAMBDA.multiple) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      properties[index] = {
        name: `${apiName}_lambdaFn_${key}`,
        typeName: "lambda.Function",
        accessModifier: "public",
      };
    });
    return properties
  }
};

export const lambdaHandlerForDynamodb = (output: TextWriter) => {
  const lambda = new Lambda(output);
  const ts = new TypeScriptWriter(output);
  if (lambdaStyle === LAMBDA.single) {
    if (database === DATABASE.dynamoDb) {
      lambda.initializeLambda(
        apiName,
        output,
        lambdaStyle,
        undefined,
        undefined,
        undefined
      );
      ts.writeLine();
      ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
    }
  } else if (lambdaStyle === LAMBDA.multiple) {
    if (database === DATABASE.dynamoDb) {
      Object.keys(mutationsAndQueries).forEach((key) => {
        lambda.initializeLambda(
          apiName,
          output,
          lambdaStyle,
          key,
          undefined,
          undefined
        );
        ts.writeLine();
        ts.writeLine(
          `this.${apiName}_lambdaFn_${key} = ${apiName}_lambdaFn_${key}`
        );
        ts.writeLine();
      });
    }
  } else {
    ts.writeLine();
  }
};
