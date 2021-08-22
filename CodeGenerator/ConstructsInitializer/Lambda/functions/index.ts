import { TextWriter } from "@yellicode/core";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import {
  APITYPE,
  DATABASE,
  LAMBDASTYLE,
} from "../../../../constant";
import { Lambda } from "../../../../Constructs/Lambda";
const model = require("../../../../model.json");
const { apiName, lambdaStyle, database, apiType } = model.api;

let mutations = {};
let queries = {};
if (apiType === APITYPE.graphql) {
  mutations = model.type.Mutation ? model.type.Mutation : {};
  queries = model.type.Query ? model.type.Query : {};
}
const mutationsAndQueries = { ...mutations, ...queries };

export const lambdaPropsHandlerForNeptunedb = () => {
  let props: { name: string; type: string }[];
  return (props = [
    {
      name: "VPCRef",
      type: "ec2.Vpc",
    },
    {
      name: "SGRef",
      type: "ec2.SecurityGroup",
    },
    {
      name: "neptuneReaderEndpoint",
      type: "string",
    },
  ]);
};

export const lambdaPropsHandlerForAuroradb = () => {
  let props: { name: string; type: string }[];
  return (props = [
    {
      name: "vpcRef",
      type: "ec2.Vpc",
    },
    {
      name: "secretRef",
      type: "string",
    },
    {
      name: "serviceRole",
      type: "iam.Role",
    },
  ]);
};

export const lambdaHandlerForAuroradb = (
  output: TextWriter,
  lambdaStyle: LAMBDASTYLE,
  dataBase: DATABASE
) => {
  const lambda = new Lambda(output);
  const ts = new TypeScriptWriter(output);

  if (
    (apiType === APITYPE.graphql && lambdaStyle === LAMBDASTYLE.single) ||
    apiType === APITYPE.rest
  ) {
    if (database === DATABASE.aurora) {
      lambda.initializeLambda(
        apiName,
        output,
        lambdaStyle,
        undefined,
        `props!.vpcRef`,
        undefined,
        [
          {
            name: "INSTANCE_CREDENTIALS",
            value: `props!.secretRef`,
          },
        ],
        undefined,
        `props!.serviceRole`
      );
      ts.writeLine();
      ts.writeLine(
        `this.${apiName}_lambdaFnArn = ${apiName}_lambdaFn.functionArn`
      );
      if (apiType === APITYPE.rest)
        ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
      ts.writeLine();
    }
  } else if (apiType === APITYPE.graphql && lambdaStyle === LAMBDASTYLE.multi) {
    if (database === DATABASE.aurora) {
      Object.keys(mutationsAndQueries).forEach((key) => {
        lambda.initializeLambda(
          apiName,
          output,
          lambdaStyle,
          key,
          `props!.vpcRef`,
          undefined,
          [
            {
              name: "INSTANCE_CREDENTIALS",
              value: `props!.secretRef`,
            },
          ],
          undefined,
          `props!.serviceRole`
        );
        ts.writeLine();
        ts.writeLine(
          `this.${apiName}_lambdaFn_${key}Arn = ${apiName}_lambdaFn_${key}.functionArn`
        );
        ts.writeLine();
      });
    } else {
      ts.writeLine();
    }
  }
};

export const lambdaHandlerForNeptunedb = (
  output: TextWriter,
  lambdaStyle: LAMBDASTYLE,
  dataBase: DATABASE
) => {
  const lambda = new Lambda(output);
  const ts = new TypeScriptWriter(output);
  if (
    (apiType === APITYPE.graphql && lambdaStyle === LAMBDASTYLE.single) ||
    apiType === APITYPE.rest
  ) {
    if (database === DATABASE.neptune) {
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
      ts.writeLine(
        `this.${apiName}_lambdaFnArn = ${apiName}_lambdaFn.functionArn`
      );
      if (apiType === APITYPE.rest)
        ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
      ts.writeLine();
    }
  } else if (apiType === APITYPE.graphql && lambdaStyle === LAMBDASTYLE.multi) {
    if (database === DATABASE.neptune) {
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
        ts.writeLine(
          `this.${apiName}_lambdaFn_${key}Arn = ${apiName}_lambdaFn_${key}.functionArn`
        );
        ts.writeLine();
      });
    } else {
      ts.writeLine();
    }
  }
};

export const lambdaProperiesHandlerForAuroraDb = (output: TextWriter) => {
  let properties: PropertyDefinition[] = [
    {
      name: `${apiName}_lambdaFnArn`,
      typeName: "string",
      accessModifier: "public",
    },
    {
      name: `${apiName}_lambdaFn`,
      typeName: "lambda.Function",
      accessModifier: "public",
    },
  ];
  if (
    ((lambdaStyle === LAMBDASTYLE.single && apiType === APITYPE.graphql) ||
      apiType === APITYPE.rest) &&
    database === DATABASE.aurora
  ) {
    properties = [
      {
        name: `${apiName}_lambdaFnArn`,
        typeName: "string",
        accessModifier: "public",
        isReadonly: true,
      },
      {
        name: `${apiName}_lambdaFn`,
        typeName: "lambda.Function",
        accessModifier: "public",
      },
    ];
    return properties;
  } else if (
    lambdaStyle === LAMBDASTYLE.multi &&
    apiType === APITYPE.graphql &&
    database === DATABASE.aurora
  ) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      properties[index] = {
        name: `${apiName}_lambdaFn_${key}Arn`,
        typeName: "string",
        accessModifier: "public",
        isReadonly: true,
      };
    });
    return properties;
  }
};

export const lambdaProperiesHandlerForNeptuneDb = (output: TextWriter) => {
  let properties: PropertyDefinition[] = [
    {
      name: `${apiName}_lambdaFnArn`,
      typeName: "string",
      accessModifier: "public",
    },
    {
      name: `${apiName}_lambdaFn`,
      typeName: "lambda.Function",
      accessModifier: "public",
    },
  ];
  if (
    ((lambdaStyle === LAMBDASTYLE.single && apiType === APITYPE.graphql) ||
      apiType === APITYPE.rest) &&
    database === DATABASE.neptune
  ) {
    properties = [
      {
        name: `${apiName}_lambdaFnArn`,
        typeName: "string",
        accessModifier: "public",
        isReadonly: true,
      },
      {
        name: `${apiName}_lambdaFn`,
        typeName: "lambda.Function",
        accessModifier: "public",
      },
    ];
    return properties;
  } else if (
    lambdaStyle === LAMBDASTYLE.multi &&
    apiType === APITYPE.graphql &&
    database === DATABASE.aurora
  ) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      properties[index] = {
        name: `${apiName}_lambdaFn_${key}Arn`,
        typeName: "string",
        accessModifier: "public",
        isReadonly: true,
      };
    });
    return properties;
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
  if (
    (apiType === APITYPE.graphql && lambdaStyle === LAMBDASTYLE.single) ||
    apiType === APITYPE.rest
  ) {
    properties = [
      {
        name: `${apiName}_lambdaFn`,
        typeName: "lambda.Function",
        accessModifier: "public",
      },
    ];
    return properties;
  } else if (apiType === APITYPE.graphql && lambdaStyle === LAMBDASTYLE.multi) {
    Object.keys(mutationsAndQueries).forEach((key, index) => {
      properties[index] = {
        name: `${apiName}_lambdaFn_${key}`,
        typeName: "lambda.Function",
        accessModifier: "public",
      };
    });
    return properties;
  }
};

export const lambdaHandlerForDynamodb = (output: TextWriter) => {
  const lambda = new Lambda(output);
  const ts = new TypeScriptWriter(output);
  if (
    (apiType === APITYPE.graphql && lambdaStyle === LAMBDASTYLE.single) ||
    apiType === APITYPE.rest
  ) {
    if (database === DATABASE.dynamo) {
      lambda.initializeLambda(
        apiName,
        output,
        lambdaStyle,
        undefined,
        undefined,
        undefined,
        [{ name: "TableName", value: "props!.tableName" }]
      );
      ts.writeLine();
      ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
    }
  } else if (apiType === APITYPE.graphql && lambdaStyle === LAMBDASTYLE.multi) {
    if (database === DATABASE.dynamo) {
      Object.keys(mutationsAndQueries).forEach((key) => {
        lambda.initializeLambda(
          apiName,
          output,
          lambdaStyle,
          key,
          undefined,
          undefined,
          [{ name: "TableName", value: "props!.tableName" }]
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
