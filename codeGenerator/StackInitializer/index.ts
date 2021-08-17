import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, LAMBDA } from "../../cloud-api-constants";
import { apiManager } from "../../Constructs/ApiManager";
import { Appsync } from "../../Constructs/Appsync";
import { Cdk } from "../../Constructs/Cdk";
import {lambdaEnvHandler,propsHandlerForAppsyncConstructDynamodb,propsHandlerForDynoDbConstruct,propsHandlerForAppsyncConstructNeptunedb, lambdaConstructPropsHandlerNeptunedb, lambdaConstructPropsHandlerAuroradb} from "./functions";
const jsonObj = require("../../model.json");
const { USER_WORKING_DIRECTORY } = jsonObj;
const fs = require("fs");
const _ = require("lodash");
Generator.generateFromModel(
  {
    outputFile: `../../../../lib/${USER_WORKING_DIRECTORY}-stack.ts`,
  },
  (output: TextWriter, model: any) => {
    const ts = new TypeScriptWriter(output);
    const mutations = model.type.Mutation ? model.type.Mutation : {};
    const queries = model.type.Query ? model.type.Query : {};
    const mutationsAndQueries = { ...mutations, ...queries };
    const appsync = new Appsync(output);
    const cdk = new Cdk(output);
    const manager = new apiManager(output);
    const { apiName, lambdaStyle, database } = model.api;
    cdk.importsForStack(output);
    manager.importApiManager(output);
    ts.writeImports(`./${CONSTRUCTS.appsync}`, [CONSTRUCTS.appsync]);
    ts.writeImports(`./${CONSTRUCTS.lambda}`, [CONSTRUCTS.lambda]);
    if (database === DATABASE.dynamoDb) {
      ts.writeImports(`./${CONSTRUCTS.dynamodb}`, [CONSTRUCTS.dynamodb]);
    }
    if (database === DATABASE.neptuneDb) {
      ts.writeImports(`./${CONSTRUCTS.neptuneDb}`, [CONSTRUCTS.neptuneDb]);
    }
    if (database === DATABASE.auroraDb) {
      ts.writeImports(`./${CONSTRUCTS.auroradb}`, [CONSTRUCTS.auroradb]);
    }
    ts.writeLine()
    cdk.initializeStack(
      `${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}`,
      () => {
           manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
           ts.writeLine();
        if (database == DATABASE.dynamoDb) {
          ts.writeLine(`const ${apiName}Lambda = new ${CONSTRUCTS.lambda}(this,"${apiName}${CONSTRUCTS.lambda}");`);
          ts.writeLine();  
          ts.writeLine(`const ${apiName}_table = new ${CONSTRUCTS.dynamodb}(this,"${apiName}${CONSTRUCTS.dynamodb}",{`);
          propsHandlerForDynoDbConstruct(output,apiName,lambdaStyle,mutationsAndQueries);
          ts.writeLine("})");
          lambdaEnvHandler(output, apiName, lambdaStyle, mutationsAndQueries);
          ts.writeLine(`const ${apiName} = new ${CONSTRUCTS.appsync}(this,"${apiName}${CONSTRUCTS.appsync}",{`);
          propsHandlerForAppsyncConstructDynamodb(output,apiName,lambdaStyle,mutationsAndQueries);
          ts.writeLine("})");  
        }
        if (database == DATABASE.neptuneDb) {
          ts.writeLine(`const ${apiName}_neptunedb = new ${CONSTRUCTS.neptuneDb}(this,"VpcNeptuneConstruct");`)
          ts.writeLine()
          ts.writeLine(`const ${apiName}Lambda = new ${CONSTRUCTS.lambda}(this,"${apiName}${CONSTRUCTS.lambda}",{`);
          lambdaConstructPropsHandlerNeptunedb(output,apiName)
          ts.writeLine("})");  
          ts.writeLine();  
          ts.writeLine(`const ${apiName} = new ${CONSTRUCTS.appsync}(this,"${apiName}${CONSTRUCTS.appsync}",{`);
          propsHandlerForAppsyncConstructNeptunedb(output,apiName,lambdaStyle,mutationsAndQueries);
          ts.writeLine("})");  
          ts.writeLine();  
        }
        if (database == DATABASE.auroraDb) {
          ts.writeLine(`const ${apiName}_auroradb = new ${CONSTRUCTS.auroradb}(this,"${CONSTRUCTS.auroradb}");`)
          ts.writeLine()
          ts.writeLine(`const ${apiName}Lambda = new ${CONSTRUCTS.lambda}(this,"${apiName}${CONSTRUCTS.lambda}",{`);
          lambdaConstructPropsHandlerAuroradb(output,apiName)
          ts.writeLine("})");  
          ts.writeLine();  
          ts.writeLine(`const ${apiName} = new ${CONSTRUCTS.appsync}(this,"${apiName}${CONSTRUCTS.appsync}",{`);
          propsHandlerForAppsyncConstructNeptunedb(output,apiName,lambdaStyle,mutationsAndQueries);
          ts.writeLine("})");  
          ts.writeLine();  
        }
      },
      output
    );
  }
);
