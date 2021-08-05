"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const Appsync_1 = require("../../Constructs/Appsync");
const Cdk_1 = require("../../Constructs/Cdk");
const functions_1 = require("./functions");
const jsonObj = require("../../model.json");
const { USER_WORKING_DIRECTORY } = jsonObj;
const fs = require("fs");
const _ = require("lodash");
templating_1.Generator.generateFromModel({
    outputFile: `../../../../lib/${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const mutations = model.type.Mutation ? model.type.Mutation : {};
    const queries = model.type.Query ? model.type.Query : {};
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    const appsync = new Appsync_1.Appsync(output);
    const cdk = new Cdk_1.Cdk(output);
    const { apiName, lambdaStyle, database } = model.api;
    cdk.importsForStack(output);
    ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.appsync}`, [cloud_api_constants_1.CONSTRUCTS.appsync]);
    ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.lambda}`, [cloud_api_constants_1.CONSTRUCTS.lambda]);
    if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
        ts.writeImports(`./${cloud_api_constants_1.CONSTRUCTS.dynamodb}`, [cloud_api_constants_1.CONSTRUCTS.dynamodb]);
    }
    cdk.initializeStack(`${_.upperFirst(_.camelCase(USER_WORKING_DIRECTORY))}`, () => {
        ts.writeLine(`const ${apiName}Lambda = new ${cloud_api_constants_1.CONSTRUCTS.lambda}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.lambda}");`);
        ts.writeLine();
        if (database == cloud_api_constants_1.DATABASE.dynamoDb) {
            const dbProps = functions_1.propsHandlerForDynoDbConstruct(output, apiName, lambdaStyle, mutationsAndQueries);
            console.log("db construct prorps ====>", dbProps);
            ts.writeLine(`const ${apiName}_table = new ${cloud_api_constants_1.CONSTRUCTS.dynamodb}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.dynamodb}",${dbProps});`);
            ts.writeLine();
        }
        functions_1.lambdaEnvHandler(output, apiName, lambdaStyle, mutationsAndQueries);
        const appsyncConstructProps = functions_1.propsHandlerForAppsyncConstruct(output, apiName, lambdaStyle, mutationsAndQueries);
        console.log("appsyn construct prorps ====>", appsyncConstructProps);
        ts.writeLine(`const ${apiName} = new ${cloud_api_constants_1.CONSTRUCTS.appsync}(this,"${apiName}${cloud_api_constants_1.CONSTRUCTS.appsync}",${appsyncConstructProps})`);
        ts.writeLine(JSON.stringify(appsyncConstructProps));
    }, output);
    // if (database === DATABASE.dynamoDb) {
    //   dynamoDB.importDynamodb(output);
    // } else if (database === DATABASE.neptuneDb) {
    //   ts.writeImports("aws-cdk-lib", ["Tags"]);
    //   neptune.importNeptune(output);
    //   ec2.importEc2(output);
    // } else if (database === DATABASE.auroraDb) {
    //   ts.writeImports("aws-cdk-lib", ["Duration"]);
    //   aurora.importRds(output);
    //   ec2.importEc2(output);
    // } else {
    //   ts.writeLine();
    // }
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
    //     `${apiName}Appsync`,
    //     lambdaStyle
    //   );
    // } else if (lambdaStyle === LAMBDA.multiple) {
    //   Object.keys(mutationsAndQueries).forEach((key) => {
    //     appsync.appsyncLambdaDataSource(
    //       output,
    //       apiName,
    //       `${apiName}Appsync`,
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
