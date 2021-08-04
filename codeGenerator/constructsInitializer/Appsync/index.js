"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Appsync_1 = require("../../../Constructs/Appsync");
const Cdk_1 = require("../../../Constructs/Cdk");
const Iam_1 = require("../../../Constructs/Iam");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const fs = require("fs");
templating_1.Generator.generateFromModel({
    outputFile: `../../../../../lib/AppsyncConstruct/index.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const appsync = new Appsync_1.Appsync(output);
    const cdk = new Cdk_1.Cdk(output);
    const iam = new Iam_1.Iam(output);
    const schema = fs.readFileSync(`../../../../../graphql/schema.graphql`).toString("utf8");
    const mutations = model.type.Mutation ? model.type.Mutation : {};
    const queries = model.type.Query ? model.type.Query : {};
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    const { apiName, lambdaStyle, database } = model.api;
    cdk.importsForStack(output);
    appsync.importAppsync(output);
    iam.importIam(output);
    let ConstructProps = [{
            name: `${apiName}_lambdaFnArn`,
            type: "string"
        }];
    if (lambdaStyle && lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        mutationsAndQueries.forEach((key, index) => {
            ConstructProps[index] = {
                name: `${apiName}_lambdaFnArn_${key}Arn`,
                type: "string"
            };
        });
    }
    cdk.initializeConstruct(`${cloud_api_constants_1.CONSTRUCTS.appsync}`, "AppsyncProps", () => {
        ts.writeLine();
        appsync.initializeAppsyncApi(apiName, output);
        ts.writeLine();
        appsync.initializeAppsyncSchema(schema, output);
        ts.writeLine();
        appsync.initializeApiKeyForAppsync(apiName);
        ts.writeLine();
        iam.serviceRoleForAppsync(output, apiName);
        ts.writeLine();
        iam.attachLambdaPolicyToRole(`${apiName}`);
        ts.writeLine();
        functions_1.appsyncDatasourceHandler(output);
        ts.writeLine();
        functions_1.appsyncResolverhandler(output);
    }, output, ConstructProps);
    // cdk.initializeStack(
    //   `${USER_WORKING_DIRECTORY}`,
    //   () => {
    //     ts.writeLine();
    //     appsync.initializeAppsyncApi(apiName, output);
    //     ts.writeLine();
    //     appsync.initializeAppsyncSchema(schema, output);
    //     ts.writeLine();
    //     appsync.initializeApiKeyForAppsync(apiName);
    //     ts.writeLine();
    //     iam.serviceRoleForAppsync(output, apiName);
    //     ts.writeLine();
    //     iam.attachLambdaPolicyToRole(`${apiName}`);
    //     ts.writeLine();
    //     appsyncDatasourceHandler(output)
    //     ts.writeLine()
    //     appsyncResolverhandler(output)
    // const mutations = model.type.Mutation ? model.type.Mutation : {};
    // const queries = model.type.Query ? model.type.Query : {};
    // const mutationsAndQueries = {
    //   ...mutations,
    //   ...queries,
    // };
    // if (database === DATABASE.neptuneDb) {
    //   ec2.initializeVpc(
    //     apiName,
    //     output,
    //     `
    //   {
    //     cidrMask: 24, 
    //     name: 'Ingress',
    //     subnetType: ec2.SubnetType.ISOLATED,
    //   }`
    //   );
    //   ts.writeLine();
    //   ec2.initializeSecurityGroup(apiName, `${apiName}_vpc`, output);
    //   ts.writeLine();
    //   cdk.tagAdd(`${apiName}_sg`, "Name", `${apiName}SecurityGroup`);
    //   ts.writeLine();
    //   ec2.securityGroupAddIngressRule(apiName, `${apiName}_sg`);
    //   ts.writeLine();
    // } else if (database === DATABASE.auroraDb) {
    //   ec2.initializeVpc(apiName, output);
    // } else {
    //   ts.writeLine();
    // }
    // if (database === DATABASE.dynamoDb) {
    //   dynamoDB.initializeDynamodb(apiName, output);
    //   ts.writeLine();
    // } else if (database === DATABASE.neptuneDb) {
    //   neptune.initializeNeptuneSubnet(apiName, `${apiName}_vpc`, output);
    //   ts.writeLine();
    //   neptune.initializeNeptuneCluster(
    //     apiName,
    //     `${apiName}_neptuneSubnet`,
    //     `${apiName}_sg`,
    //     output
    //   );
    //   neptune.addDependsOn(
    //     `${apiName}_neptuneCluster`,
    //     `${apiName}_neptuneSubnet`
    //   );
    //   ts.writeLine();
    //   neptune.initializeNeptuneInstance(
    //     apiName,
    //     `${apiName}_vpc`,
    //     `${apiName}_neptuneCluster`,
    //     output
    //   );
    //   neptune.addDependsOn(
    //     `${apiName}_neptuneInstance`,
    //     `${apiName}_neptuneCluster`
    //   );
    //   ts.writeLine();
    // } else if (database === DATABASE.auroraDb) {
    //   aurora.initializeAuroraCluster(apiName, `${apiName}_vpc`, output);
    //   ts.writeLine();
    //   iam.serviceRoleForLambda(apiName, output, [
    //     "AmazonRDSDataFullAccess",
    //     "service-role/AWSLambdaVPCAccessExecutionRole",
    //   ]);
    //   ts.writeLine();
    //   ts.writeVariableDeclaration(
    //     {
    //       name: `${apiName}_secret`,
    //       typeName: "",
    //       initializer: () => {
    //         ts.writeLine(`${apiName}_db.secret?.secretArn || "secret"`);
    //       },
    //     },
    //     "const"
    //   );
    //   ts.writeLine();
    //   aurora.connectionsAllowFromAnyIpv4(`${apiName}_db`);
    // } else {
    //   ts.writeLine();
    // }
    // if (lambdaStyle === LAMBDA.single) {
    //   if (database === DATABASE.dynamoDb) {
    //     lambda.initializeLambda(
    //       apiName,
    //       output,
    //       lambdaStyle,
    //       undefined,
    //       undefined,
    //       undefined,
    //       [{ name: "TABLE_NAME", value: `${apiName}_table.tableName` }]
    //     );
    //   } else if (database === DATABASE.neptuneDb) {
    //     lambda.initializeLambda(
    //       apiName,
    //       output,
    //       lambdaStyle,
    //       undefined,
    //       `${apiName}_vpc`,
    //       `${apiName}_sg`,
    //       [
    //         {
    //           name: "NEPTUNE_ENDPOINT",
    //           value: `${apiName}_neptuneCluster.attrEndpoint`,
    //         },
    //       ],
    //       `ec2.SubnetType.ISOLATED`
    //     );
    //   } else if (database === DATABASE.auroraDb) {
    //     ts.writeLine();
    //     lambda.initializeLambda(
    //       apiName,
    //       output,
    //       lambdaStyle,
    //       undefined,
    //       `${apiName}_vpc`,
    //       undefined,
    //       [
    //         {
    //           name: "INSTANCE_CREDENTIALS",
    //           value: `${apiName}_secret`,
    //         },
    //       ],
    //       undefined,
    //       `${apiName}Lambda_serviceRole`
    //     );
    //   } else {
    //     ts.writeLine();
    //   }
    // } else if (lambdaStyle === LAMBDA.multiple) {
    //   if (database === DATABASE.dynamoDb) {
    //     Object.keys(mutationsAndQueries).forEach((key) => {
    //       lambda.initializeLambda(
    //         apiName,
    //         output,
    //         lambdaStyle,
    //         key,
    //         undefined,
    //         undefined,
    //         [{ name: "TABLE_NAME", value: `${apiName}_table.tableName` }]
    //       );
    //       ts.writeLine();
    //     });
    //   } else if (database === DATABASE.neptuneDb) {
    //     Object.keys(mutationsAndQueries).forEach((key) => {
    //       lambda.initializeLambda(
    //         apiName,
    //         output,
    //         lambdaStyle,
    //         key,
    //         `${apiName}_vpc`,
    //         `${apiName}_sg`,
    //         [
    //           {
    //             name: "NEPTUNE_ENDPOINT",
    //             value: `${apiName}_neptuneCluster.attrEndpoint`,
    //           },
    //         ],
    //         `ec2.SubnetType.ISOLATED`
    //       );
    //       ts.writeLine();
    //     });
    //   } else if (database === DATABASE.auroraDb) {
    //     Object.keys(mutationsAndQueries).forEach((key) => {
    //       lambda.initializeLambda(
    //         apiName,
    //         output,
    //         lambdaStyle,
    //         key,
    //         `${apiName}_vpc`,
    //         undefined,
    //         [
    //           {
    //             name: "INSTANCE_CREDENTIALS",
    //             value: `${apiName}_secret`,
    //           },
    //         ],
    //         undefined,
    //         `${apiName}Lambda_serviceRole`
    //       );
    //       ts.writeLine();
    //     });
    //   } else {
    //     ts.writeLine();
    //   }
    // } else {
    //   ts.writeLine();
    // }
    // if (database === DATABASE.dynamoDb) {
    //   if (lambdaStyle === LAMBDA.single) {
    //     dynamoDB.grantFullAccess(
    //       `${apiName}`,
    //       `${apiName}_table`,
    //       lambdaStyle
    //     );
    //   } else if (lambdaStyle === LAMBDA.multiple) {
    //     Object.keys(mutationsAndQueries).forEach((key) => {
    //       dynamoDB.grantFullAccess(
    //         `${apiName}`,
    //         `${apiName}_table`,
    //         lambdaStyle,
    //         key
    //       );
    //       ts.writeLine();
    //     });
    //   }
    // }
    // if (lambdaStyle === LAMBDA.single) {
    //   appsync.appsyncLambdaDataSource(
    //     output,
    //     apiName,
    //     `${apiName}`,
    //     lambdaStyle
    //   );
    // } else if (lambdaStyle === LAMBDA.multiple) {
    //   Object.keys(mutationsAndQueries).forEach((key) => {
    //     appsync.appsyncLambdaDataSource(
    //       output,
    //       apiName,
    //       `${apiName}`,
    //       lambdaStyle,
    //       key
    //     );
    //     ts.writeLine();
    //   });
    // } else {
    //   ts.writeLine();
    // }
    // if (model?.type?.Query) {
    //   for (var key in model?.type?.Query) {
    //     if (lambdaStyle === LAMBDA.single) {
    //       appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}`,output);
    //     } else if (lambdaStyle === LAMBDA.multiple) {
    //       appsync.appsyncLambdaResolver(
    //         key,
    //         "Query",
    //         `ds_${apiName}_${key}`,
    //         output
    //       );
    //     }
    //   }
    //   ts.writeLine();
    // }
    // if (model?.type?.Mutation) {
    //   for (var key in model?.type?.Mutation) {
    //     if (lambdaStyle === LAMBDA.single) {
    //       appsync.appsyncLambdaResolver(
    //         key,
    //         "Mutation",
    //         `ds_${apiName}`,
    //         output
    //       );
    //     } else if (lambdaStyle === LAMBDA.multiple) {
    //       appsync.appsyncLambdaResolver(
    //         key,
    //         "Mutation",
    //         `ds_${apiName}_${key}`,
    //         output
    //       );
    //     }
    //   }
    //   ts.writeLine();
    // }
});
