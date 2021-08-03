import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { apiManager } from "../../functions/api-manager";
import { Appsync } from "../../functions/Appsync";
import { DynamoDB } from "../../functions/dynamoDB";
import { Neptune } from "../../functions/neptune";
import { AuroraServerless } from "../../functions/auroraServerless";
import { Iam } from "../../functions/iam";
import { Ec2 } from "../../functions/ec2";
import { Cdk } from "../../functions/cdk";
import { Lambda } from "../../functions/lambda";
import { BasicClass } from "../../functions/utils/class";
import { DATABASE, LAMBDA } from "../../cloud-api-constants";
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const fs = require("fs");

Generator.generateFromModel(
  {
    outputFile: `../../../../lib/${USER_WORKING_DIRECTORY}-stack.ts`,
  },
  (output: TextWriter, model: any) => {
    const ts = new TypeScriptWriter(output);
    const lambda = new Lambda(output);
    const dynamoDB = new DynamoDB(output);
    const neptune = new Neptune(output);
    const aurora = new AuroraServerless(output);
    const appsync = new Appsync(output);
    const ec2 = new Ec2(output);
    const cdk = new Cdk(output);
    const iam = new Iam(output);
    const manager = new apiManager(output);
    const cls = new BasicClass(output);
    const schema = fs
      .readFileSync(`../../../../graphql/schema.graphql`)
      .toString("utf8");

    const { apiName, lambdaStyle, database } = model.api;
    ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
    ts.writeImports("constructs", ["Construct"]);
    appsync.importAppsync(output);
    manager.importApiManager(output);
    lambda.importLambda(output);
    iam.importIam(output);

    if (database === DATABASE.dynamoDb) {
      dynamoDB.importDynamodb(output);
    } else if (database === DATABASE.neptuneDb) {
      ts.writeImports("aws-cdk-lib", ["Tags"]);
      neptune.importNeptune(output);
      ec2.importEc2(output);
    } else if (database === DATABASE.auroraDb) {
      ts.writeImports("aws-cdk-lib", ["Duration"]);
      aurora.importRds(output);
      ec2.importEc2(output);
    } else {
      ts.writeLine();
    }

    cls.initializeClass(
      `${USER_WORKING_DIRECTORY}`,
      () => {
        manager.apiManagerInitializer(output, USER_WORKING_DIRECTORY);
        ts.writeLine();
        appsync.initializeAppsyncApi(apiName, output);
        ts.writeLine();
        appsync.initializeAppsyncSchema(schema, output);
        ts.writeLine();
        appsync.initializeApiKeyForAppsync(apiName);
        ts.writeLine();
        iam.serviceRoleForAppsync(output, apiName);
        ts.writeLine();
        iam.attachLambdaPolicyToRole(`${apiName}Appsync`);
        ts.writeLine();

        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};

        const mutationsAndQueries = {
          ...mutations,
          ...queries,
        };

        if (database === DATABASE.neptuneDb) {
          ec2.initializeVpc(
            apiName,
            output,
            `
          {
            cidrMask: 24, 
            name: 'Ingress',
            subnetType: ec2.SubnetType.ISOLATED,
          }`
          );
          ts.writeLine();
          ec2.initializeSecurityGroup(apiName, `${apiName}_vpc`, output);
          ts.writeLine();
          cdk.tagAdd(`${apiName}_sg`, "Name", `${apiName}SecurityGroup`);
          ts.writeLine();
          ec2.securityGroupAddIngressRule(apiName, `${apiName}_sg`);
          ts.writeLine();
        } else if (database === DATABASE.auroraDb) {
          ec2.initializeVpc(apiName, output);
        } else {
          ts.writeLine();
        }

        if (database === DATABASE.dynamoDb) {
          dynamoDB.initializeDynamodb(apiName, output);
          ts.writeLine();
        } else if (database === DATABASE.neptuneDb) {
          neptune.initializeNeptuneSubnet(apiName, `${apiName}_vpc`, output);
          ts.writeLine();
          neptune.initializeNeptuneCluster(
            apiName,
            `${apiName}_neptuneSubnet`,
            `${apiName}_sg`,
            output
          );
          neptune.addDependsOn(
            `${apiName}_neptuneCluster`,
            `${apiName}_neptuneSubnet`
          );
          ts.writeLine();
          neptune.initializeNeptuneInstance(
            apiName,
            `${apiName}_vpc`,
            `${apiName}_neptuneCluster`,
            output
          );
          neptune.addDependsOn(
            `${apiName}_neptuneInstance`,
            `${apiName}_neptuneCluster`
          );
          ts.writeLine();
        } else if (database === DATABASE.auroraDb) {
          aurora.initializeAuroraCluster(apiName, `${apiName}_vpc`, output);
          ts.writeLine();
          iam.serviceRoleForLambda(apiName, output, [
            "AmazonRDSDataFullAccess",
            "service-role/AWSLambdaVPCAccessExecutionRole",
          ]);
          ts.writeLine();
          ts.writeVariableDeclaration(
            {
              name: `${apiName}_secret`,
              typeName: "",
              initializer: () => {
                ts.writeLine(`${apiName}_db.secret?.secretArn || "secret"`);
              },
            },
            "const"
          );
          ts.writeLine();
          aurora.connectionsAllowFromAnyIpv4(`${apiName}_db`);
        } else {
          ts.writeLine();
        }

        if (lambdaStyle === LAMBDA.single) {
          if (database === DATABASE.dynamoDb) {
            lambda.initializeLambda(
              apiName,
              output,
              lambdaStyle,
              undefined,
              undefined,
              undefined,
              [{ name: "TABLE_NAME", value: `${apiName}_table.tableName` }]
            );
          } else if (database === DATABASE.neptuneDb) {
            lambda.initializeLambda(
              apiName,
              output,
              lambdaStyle,
              undefined,
              `${apiName}_vpc`,
              `${apiName}_sg`,
              [
                {
                  name: "NEPTUNE_ENDPOINT",
                  value: `${apiName}_neptuneCluster.attrEndpoint`,
                },
              ],
              `ec2.SubnetType.ISOLATED`
            );
          } else if (database === DATABASE.auroraDb) {
            ts.writeLine();
            lambda.initializeLambda(
              apiName,
              output,
              lambdaStyle,
              undefined,
              `${apiName}_vpc`,
              undefined,
              [
                {
                  name: "INSTANCE_CREDENTIALS",
                  value: `${apiName}_secret`,
                },
              ],
              undefined,
              `${apiName}Lambda_serviceRole`
            );
          } else {
            ts.writeLine();
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
                undefined,
                [{ name: "TABLE_NAME", value: `${apiName}_table.tableName` }]
              );
              ts.writeLine();
            });
          } else if (database === DATABASE.neptuneDb) {
            Object.keys(mutationsAndQueries).forEach((key) => {
              lambda.initializeLambda(
                apiName,
                output,
                lambdaStyle,
                key,
                `${apiName}_vpc`,
                `${apiName}_sg`,
                [
                  {
                    name: "NEPTUNE_ENDPOINT",
                    value: `${apiName}_neptuneCluster.attrEndpoint`,
                  },
                ],
                `ec2.SubnetType.ISOLATED`
              );
              ts.writeLine();
            });
          } else if (database === DATABASE.auroraDb) {
            Object.keys(mutationsAndQueries).forEach((key) => {
              lambda.initializeLambda(
                apiName,
                output,
                lambdaStyle,
                key,
                `${apiName}_vpc`,
                undefined,
                [
                  {
                    name: "INSTANCE_CREDENTIALS",
                    value: `${apiName}_secret`,
                  },
                ],
                undefined,
                `${apiName}Lambda_serviceRole`
              );
              ts.writeLine();
            });
          } else {
            ts.writeLine();
          }
        } else {
          ts.writeLine();
        }

        if (database === DATABASE.dynamoDb) {
          if (lambdaStyle === LAMBDA.single) {
            dynamoDB.grantFullAccess(
              `${apiName}`,
              `${apiName}_table`,
              lambdaStyle
            );
          } else if (lambdaStyle === LAMBDA.multiple) {
            Object.keys(mutationsAndQueries).forEach((key) => {
              dynamoDB.grantFullAccess(
                `${apiName}`,
                `${apiName}_table`,
                lambdaStyle,
                key
              );
              ts.writeLine();
            });
          }
        }

        if (lambdaStyle === LAMBDA.single) {
          appsync.appsyncDataSource(
            output,
            apiName,
            `${apiName}Appsync`,
            lambdaStyle
          );
        } else if (lambdaStyle === LAMBDA.multiple) {
          Object.keys(mutationsAndQueries).forEach((key) => {
            appsync.appsyncDataSource(
              output,
              apiName,
              `${apiName}Appsync`,
              lambdaStyle,
              key
            );
            ts.writeLine();
          });
        } else {
          ts.writeLine();
        }

        if (model?.type?.Query) {
          for (var key in model?.type?.Query) {
            if (lambdaStyle === LAMBDA.single) {
              appsync.lambdaDataSourceResolver(key, "Query", `ds_${apiName}`);
            } else if (lambdaStyle === LAMBDA.multiple) {
              appsync.lambdaDataSourceResolver(
                key,
                "Query",
                `ds_${apiName}_${key}`
              );
            }
          }
          ts.writeLine();
        }

        if (model?.type?.Mutation) {
          for (var key in model?.type?.Mutation) {
            if (lambdaStyle === LAMBDA.single) {
              appsync.lambdaDataSourceResolver(
                key,
                "Mutation",
                `ds_${apiName}`
              );
            } else if (lambdaStyle === LAMBDA.multiple) {
              appsync.lambdaDataSourceResolver(
                key,
                "Mutation",
                `ds_${apiName}_${key}`
              );
            }
          }
          ts.writeLine();
        }
      },
      output
    );
  }
);
