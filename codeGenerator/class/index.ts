import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { apiManager } from "../../functions/api-manager";
import { Appsync } from "../../functions/Appsync";
import { DynamoDB } from "../../functions/dynamoDB";
import { Lambda } from "../../functions/lambda";
import { BasicClass } from "../../functions/utils/class";
const model = require('../../model.json')
const {USER_WORKING_DIRECTORY} = model
const {API_NAME} = model

Generator.generateFromModel(
  {outputFile: `../../../${USER_WORKING_DIRECTORY}/lib/${USER_WORKING_DIRECTORY}-stack.ts`},
  (output: TextWriter, model: any) => {
    const ts = new TypeScriptWriter(output);
    const lambda = new Lambda(output);
    const db = new DynamoDB(output);
    const appsync = new Appsync(output);
    const manager = new apiManager(output)
    const cls = new BasicClass(output);

    ts.writeImports("@aws-cdk/core", "cdk");
    appsync.importAppsync(output);
    manager.importApiManager(output)
    lambda.importLambda(output);
    db.importDynamodb(output);

    cls.initializeClass(
      "PanacloudStack",
      () => {
        manager.apiManagerInitializer(output,USER_WORKING_DIRECTORY)
        ts.writeLine();
        appsync.initializeAppsyncApi(API_NAME,output);
        ts.writeLine();
        lambda.initializeLambda(API_NAME,output);
        ts.writeLine();
        appsync.appsyncDataSource(output, API_NAME )
        ts.writeLine();

        for (var key in model?.type?.Query) {
          appsync.lambdaDataSourceResolver(key,"Query","todoApp");
        }
        ts.writeLine();
        for (var key in model?.type?.Mutation) {
          appsync.lambdaDataSourceResolver(key,"Mutation","todoApp");
        }
        ts.writeLine();
        db.initializeDynamodb("todoTable");
        ts.writeLine();
        db.grantFullAccess("lambdaFn");
        ts.writeLine();
        lambda.addEnvironment("TODOS_TABLE", "table.tableName");
        ts.writeLine();
      },
      output
    );
  }
);
