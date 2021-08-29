import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition } from "@yellicode/typescript";
import {
  APITYPE,
  CONSTRUCTS,
  DATABASE,
  LAMBDASTYLE,
  PATH,
} from "../../../utils/constant";
import { Cdk } from "../../../lib/Cdk";
import { Imports } from "../../../lib/ConstructsImports";
import {
  lambdaHandlerForAuroradb,
  lambdaHandlerForDynamodb,
  lambdaHandlerForNeptunedb,
  lambdaProperiesHandlerForAuroraDb,
  lambdaProperiesHandlerForDynoDb,
  lambdaProperiesHandlerForNeptuneDb,
  lambdaPropsHandlerForAuroradb,
  lambdaPropsHandlerForNeptunedb,
} from "./functions";
const model = require("../../../../../model.json");

Generator.generate(
  {
    outputFile: `${PATH.construct}${CONSTRUCTS.lambda}/index.ts`,
  },
  (output: TextWriter) => {
    const { apiName, lambdaStyle, database, apiType } = model.api;
    let mutations = {};
    let queries = {};
    if (apiType === APITYPE.graphql) {
      mutations = model.type.Mutation ? model.type.Mutation : {};
      queries = model.type.Query ? model.type.Query : {};
    }
    const mutationsAndQueries = { ...mutations, ...queries };

    let lambdaPropsWithName: string | undefined;
    let lambdaProps: { name: string; type: string }[] | undefined;
    let lambdaProperties: PropertyDefinition[] | undefined;

    const cdk = new Cdk(output);
    const imp = new Imports(output);

    imp.importsForStack(output);
    imp.importEc2(output);
    imp.importLambda(output);
    imp.importIam(output);

    if (database === DATABASE.dynamo) {
      lambdaProps = [
        {
          name: "tableName",
          type: "string",
        },
      ];
      lambdaPropsWithName = "handlerProps";
      lambdaProperties = lambdaProperiesHandlerForDynoDb(
        lambdaStyle,
        apiName,
        apiType,
        mutationsAndQueries
      );
    }
    if (database === DATABASE.neptune) {
      lambdaPropsWithName = "handlerProps";
      lambdaProps = lambdaPropsHandlerForNeptunedb();
      lambdaProperties = lambdaProperiesHandlerForNeptuneDb(
        apiName,
        apiType,
        lambdaStyle,
        database,
        mutationsAndQueries
      );
    }
    if (database === DATABASE.aurora) {
      lambdaPropsWithName = "handlerProps";
      lambdaProps = lambdaPropsHandlerForAuroradb();
      lambdaProperties = lambdaProperiesHandlerForAuroraDb(
        apiName,
        apiType,
        lambdaStyle,
        database,
        mutationsAndQueries
      );
    }
    cdk.initializeConstruct(
      CONSTRUCTS.lambda,
      lambdaPropsWithName,
      () => {
        if (database === DATABASE.dynamo) {
          lambdaHandlerForDynamodb(
            output,
            apiName,
            apiType,
            lambdaStyle,
            database,
            mutationsAndQueries
          );
        }
        if (database === DATABASE.neptune) {
          lambdaHandlerForNeptunedb(
            output,
            lambdaStyle,
            database,
            apiType,
            apiName,
            mutationsAndQueries
          );
        }
        if (database === DATABASE.aurora) {
          lambdaHandlerForAuroradb(
            output,
            lambdaStyle,
            database,
            apiType,
            apiName,
            mutationsAndQueries
          );
        }
      },
      output,
      lambdaProps,
      lambdaProperties
    );
  }
);
