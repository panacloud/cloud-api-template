import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, APITYPE, PATH } from "../../cloud-api-constants";
import { apiManager } from "../../Constructs/ApiManager";
import { Cdk } from "../../Constructs/Cdk";
import { DynamoDB } from "../../Constructs/DynamoDB";
import {
  lambdaEnvHandler,
  propsHandlerForAppsyncConstructDynamodb,
  propsHandlerForDynamoDbConstruct,
  propsHandlerForAppsyncConstructNeptunedb,
  lambdaConstructPropsHandlerNeptunedb,
  lambdaConstructPropsHandlerAuroradb,
  propsHandlerForApiGatewayConstruct,
} from "./functions";
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const _ = require("lodash");

Generator.generate(
  {
    outputFile: `${PATH.lib}${USER_WORKING_DIRECTORY}-stack.ts`,
  },
  (output: TextWriter) => {
    const ts = new TypeScriptWriter(output);
    const { apiName, lambdaStyle, database, apiType } = model.api;

    let mutations = {};
    let queries = {};
    if (apiType === APITYPE.graphql) {
      mutations = model.type.Mutation ? model.type.Mutation : {};
      queries = model.type.Query ? model.type.Query : {};
    }

    const mutationsAndQueries = { ...mutations, ...queries };
    const cdk = new Cdk(output);
    const dynamodb = new DynamoDB(output);
    const manager = new apiManager(output);
    cdk.importsForStack(output);
    manager.importApiManager(output);
    if (apiType === APITYPE.graphql) {
      ts.writeImports(`./${CONSTRUCTS.appsync}`, [CONSTRUCTS.appsync]);
    } else {
      ts.writeImports(`./${CONSTRUCTS.apigateway}`, [CONSTRUCTS.apigateway]);
    }
    ts.writeImports(`./${CONSTRUCTS.lambda}`, [CONSTRUCTS.lambda]);
    if (database === DATABASE.dynamo) {
      cdk.importForDynamodbConstruct(output);
    }
    if (database === DATABASE.neptune) {
      ts.writeImports(`./${CONSTRUCTS.neptuneDb}`, [CONSTRUCTS.neptuneDb]);
    }
    if (database === DATABASE.aurora) {
      ts.writeImports(`./${CONSTRUCTS.auroradb}`, [CONSTRUCTS.auroradb]);
    }
    ts.writeLine();
    cdk.initializeStack(
      `${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}`,
      () => {
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        if (database == DATABASE.dynamo) {
          ts.writeLine(
            `const ${apiName}Lambda = new ${CONSTRUCTS.lambda}(this,"${apiName}${CONSTRUCTS.lambda}");`
          );
          ts.writeLine();
          ts.writeLine(
            `const ${apiName}_table = new ${CONSTRUCTS.dynamodb}(this,"${apiName}${CONSTRUCTS.dynamodb}",{`
          );
          propsHandlerForDynamoDbConstruct(
            output,
            apiName,
            lambdaStyle,
            mutationsAndQueries
          );
          ts.writeLine("})");
          lambdaEnvHandler(output, apiName, lambdaStyle, mutationsAndQueries);

          if (apiType === APITYPE.graphql) {
            ts.writeLine(
              `const ${apiName} = new ${CONSTRUCTS.appsync}(this,"${apiName}${CONSTRUCTS.appsync}",{`
            );
            propsHandlerForAppsyncConstructDynamodb(
              output,
              apiName,
              lambdaStyle,
              mutationsAndQueries
            );
            ts.writeLine("})");
          }
        } else if (database == DATABASE.neptune) {
          ts.writeLine(
            `const ${apiName}_neptunedb = new ${CONSTRUCTS.neptuneDb}(this,"VpcNeptuneConstruct");`
          );
          ts.writeLine();
          ts.writeLine(
            `const ${apiName}Lambda = new ${CONSTRUCTS.lambda}(this,"${apiName}${CONSTRUCTS.lambda}",{`
          );
          lambdaConstructPropsHandlerNeptunedb(output, apiName);
          ts.writeLine("})");
          ts.writeLine();
          if (apiType === APITYPE.graphql) {
            ts.writeLine(
              `const ${apiName} = new ${CONSTRUCTS.appsync}(this,"${apiName}${CONSTRUCTS.appsync}",{`
            );
            propsHandlerForAppsyncConstructNeptunedb(
              output,
              apiName,
              lambdaStyle,
              mutationsAndQueries
            );
            ts.writeLine("})");
          }
          ts.writeLine();
        } else if (database == DATABASE.aurora) {
          ts.writeLine(
            `const ${apiName}_auroradb = new ${CONSTRUCTS.auroradb}(this,"${CONSTRUCTS.auroradb}");`
          );
          ts.writeLine();
          ts.writeLine(
            `const ${apiName}Lambda = new ${CONSTRUCTS.lambda}(this,"${apiName}${CONSTRUCTS.lambda}",{`
          );
          lambdaConstructPropsHandlerAuroradb(output, apiName);
          ts.writeLine("})");
          ts.writeLine();
          if (apiType === APITYPE.graphql) {
            ts.writeLine(
              `const ${apiName} = new ${CONSTRUCTS.appsync}(this,"${apiName}${CONSTRUCTS.appsync}",{`
            );
            propsHandlerForAppsyncConstructNeptunedb(
              output,
              apiName,
              lambdaStyle,
              mutationsAndQueries
            );
            ts.writeLine("})");
          }
          ts.writeLine();
        }

        if (apiType === APITYPE.rest) {
          ts.writeLine(
            `const ${apiName} = new ${CONSTRUCTS.apigateway}(this,"${apiName}${CONSTRUCTS.apigateway}",{`
          );
          propsHandlerForApiGatewayConstruct(output, apiName);
          ts.writeLine("})");
        }
      },

      output
    );
  }
);
