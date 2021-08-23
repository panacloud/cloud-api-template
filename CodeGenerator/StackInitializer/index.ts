import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import {CONSTRUCTS,DATABASE,APITYPE,PATH,LAMBDASTYLE} from "../../constant";
import { apiManager } from "../../Constructs/ApiManager";
import { Cdk } from "../../Constructs/Cdk";
import { Imports } from "../../Constructs/ConstructsImports";
import {
  propsHandlerForAppsyncConstructDynamodb,
  propsHandlerForAppsyncConstructNeptunedb,
  lambdaConstructPropsHandlerNeptunedb,
  lambdaConstructPropsHandlerAuroradb,
  propsHandlerForApiGatewayConstruct,
  lambdaPropsHandlerDynamodb,
  LambdaAccessHandler,
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
    const imp = new Imports(output);
    const manager = new apiManager(output);
    imp.importsForStack(output);
    imp.importApiManager(output);
    if (apiType === APITYPE.graphql) {
      imp.importForAppsyncConstruct(output);
    } else {
      imp.importForApiGatewayConstruct(output);
    }
    imp.importForLambdaConstruct(output);
    if (database === DATABASE.dynamo) {
      imp.importForDynamodbConstruct(output);
    }
    if (database === DATABASE.neptune) {
      imp.importForNeptuneConstruct(output);
    }
    if (database === DATABASE.aurora) {
      imp.importForAuroraDbConstruct(output);
    }
    ts.writeLine();
    cdk.initializeStack(
      `${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}`,
      () => {
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        if (database == DATABASE.dynamo) {
          ts.writeVariableDeclaration(
            {
              name: `${apiName}_table`,
              typeName: CONSTRUCTS.dynamodb,
              initializer: () => {
                ts.writeLine(
                  `new ${CONSTRUCTS.dynamodb}(this,"${apiName}${CONSTRUCTS.dynamodb}")`
                );
              },
            },
            "const"
          );
          ts.writeLine();
        } else if (database == DATABASE.neptune) {
          ts.writeVariableDeclaration({
            name:`${apiName}_neptunedb`,
            typeName:CONSTRUCTS.neptuneDb,
            initializer:()=>{
              ts.writeLine(`new ${CONSTRUCTS.neptuneDb}(this,"${apiName}${CONSTRUCTS.neptuneDb}")`)
            }},
           "const")
          ts.writeLine();
        } else if (database == DATABASE.aurora) {
          ts.writeVariableDeclaration({
            name:`${apiName}_auroradb`,
            typeName:CONSTRUCTS.auroradb,
            initializer:()=>{
              ts.writeLine(`new ${CONSTRUCTS.auroradb}(this,"${CONSTRUCTS.auroradb}");`)
            }
          },"const")
          ts.writeLine();
        }

        ts.writeVariableDeclaration(
          {
            name: `${apiName}Lambda`,
            typeName: CONSTRUCTS.lambda,
            initializer: () => {
              ts.writeLine(
                `new ${CONSTRUCTS.lambda}(this,"${apiName}${CONSTRUCTS.lambda}",{`
              );
              database === DATABASE.dynamo && lambdaPropsHandlerDynamodb(output, `${apiName}_table`);
              database === DATABASE.neptune && lambdaConstructPropsHandlerNeptunedb(output, apiName);
              database === DATABASE.aurora && lambdaConstructPropsHandlerAuroradb(output, apiName);
            ts.writeLine("})");
            },
          },
          "const"
        );
        
        database === DATABASE.dynamo && LambdaAccessHandler( output, apiName, lambdaStyle ,apiType, mutationsAndQueries )

        if (apiType === APITYPE.graphql) {
          ts.writeVariableDeclaration(
            {
              name: `${apiName}`,
              typeName: CONSTRUCTS.appsync,
              initializer: () => {
                ts.writeLine(
                  `new ${CONSTRUCTS.appsync}(this,"${apiName}${CONSTRUCTS.appsync}",{`
                );
                database === DATABASE.dynamo && propsHandlerForAppsyncConstructDynamodb(output,apiName,lambdaStyle,mutationsAndQueries);
                database === DATABASE.neptune && propsHandlerForAppsyncConstructNeptunedb(output,apiName,lambdaStyle,mutationsAndQueries);
                database === DATABASE.aurora &&  propsHandlerForAppsyncConstructNeptunedb(output,apiName,lambdaStyle,mutationsAndQueries);
                ts.writeLine("})");
              },
            },
            "const"
          );
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
