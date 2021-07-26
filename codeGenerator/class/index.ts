import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { apiManager } from "../../functions/api-manager";
import { Appsync } from "../../functions/Appsync";
import { DynamoDB } from "../../functions/dynamoDB";
import { Iam } from "../../functions/iam";
import { Lambda } from "../../functions/lambda";
import { BasicClass } from "../../functions/utils/class";
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY, API_NAME, LAMBDA_STYLE } = model;
const fs = require("fs");

Generator.generateFromModel(
  {
    outputFile: `../../../${USER_WORKING_DIRECTORY}/lib/${USER_WORKING_DIRECTORY}-stack.ts`,
  },
  (output: TextWriter, model: any) => {
    const ts = new TypeScriptWriter(output);
    const lambda = new Lambda(output);
    const db = new DynamoDB(output);
    const appsync = new Appsync(output);
    const iam = new Iam(output);
    const manager = new apiManager(output);
    const cls = new BasicClass(output);
    const schema = fs
      .readFileSync(`../../../${USER_WORKING_DIRECTORY}/graphql/schema.graphql`)
      .toString("utf8");

    ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
    ts.writeImports("constructs", ["Construct"]);
    appsync.importAppsync(output);
    manager.importApiManager(output);
    lambda.importLambda(output);
    iam.importIam(output);
    db.importDynamodb(output);

    cls.initializeClass(
      `${USER_WORKING_DIRECTORY}`,
      () => {
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        appsync.initializeAppsyncApi(API_NAME, output);
        ts.writeLine();
        appsync.initializeAppsyncSchema(schema, output);
        ts.writeLine();
        appsync.initializeApiKeyForAppsync(API_NAME);
        ts.writeLine();
        iam.serviceRoleForAppsync(output, API_NAME);
        ts.writeLine();
        iam.attachLambdaPolicyToRole(API_NAME);
        ts.writeLine();

        const mutations = model.type.Mutation? model.type.Mutation : {}
        const queries = model.type.Query? model.type.Query : {}
        const mutationsAndQueries = {
          ...mutations, ...queries
        }
        console.log(mutationsAndQueries);

        if (LAMBDA_STYLE === "single lambda") {
          lambda.initializeLambda(API_NAME, output, LAMBDA_STYLE);
        }
        else if(LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
              lambda.initializeLambda(API_NAME, output, LAMBDA_STYLE, key);
              ts.writeLine();
            })
        }

        if (LAMBDA_STYLE === "single lambda") {
          appsync.appsyncDataSource(output, API_NAME, API_NAME, LAMBDA_STYLE);
        }
        else if(LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
              appsync.appsyncDataSource(output, API_NAME, API_NAME, LAMBDA_STYLE, key);
              ts.writeLine();
            })
        }

        db.initializeDynamodb(API_NAME, output);
        ts.writeLine();

        if (LAMBDA_STYLE === "single lambda") {
          db.grantFullAccess(`${API_NAME}`, `${API_NAME}_table`, LAMBDA_STYLE);
        }
        else if(LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
              db.grantFullAccess(`${API_NAME}`, `${API_NAME}_table`, LAMBDA_STYLE, key);
              ts.writeLine();
            })
        }


        if (model?.type?.Query) {
          for (var key in model?.type?.Query) {
            if (LAMBDA_STYLE === "single lambda") {
              appsync.lambdaDataSourceResolver(key, "Query", `ds_${API_NAME}`);
            }
            else if(LAMBDA_STYLE === "multiple lambda") {
              appsync.lambdaDataSourceResolver(key, "Query", `ds_${API_NAME}_${key}`);
            }
            
          }
          ts.writeLine();
        }

        if (model?.type?.Mutation) {
          for (var key in model?.type?.Mutation) {
            if (LAMBDA_STYLE === "single lambda") {
              appsync.lambdaDataSourceResolver(key, "Mutation", `ds_${API_NAME}`);
            }
            else if(LAMBDA_STYLE === "multiple lambda") {
              appsync.lambdaDataSourceResolver(key, "Mutation", `ds_${API_NAME}_${key}`);
            }
          }
          ts.writeLine();
        }

        if (LAMBDA_STYLE === "single lambda") {
          lambda.addEnvironment(
            `${API_NAME}`,
            `${API_NAME}_TABLE`,
            `${API_NAME}_table.tableName`,
            LAMBDA_STYLE
          );
        }
        else if(LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
              lambda.addEnvironment(
                `${API_NAME}`,
                `${API_NAME}_TABLE`,
                `${API_NAME}_table.tableName`,
                LAMBDA_STYLE,
                `${key}`
              );
              ts.writeLine();
            })
        }
      },
      output
    );
  }
);
