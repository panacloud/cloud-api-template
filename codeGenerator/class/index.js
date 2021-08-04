"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../cloud-api-constants");
const ApiManager_1 = require("../../Constructs/ApiManager");
const Appsync_1 = require("../../Constructs/Appsync");
const AuroraServerless_1 = require("../../Constructs/AuroraServerless");
const Cdk_1 = require("../../Constructs/Cdk");
const DynamoDB_1 = require("../../Constructs/DynamoDB");
const Ec2_1 = require("../../Constructs/Ec2");
const Iam_1 = require("../../Constructs/Iam");
const Lambda_1 = require("../../Constructs/Lambda");
const Neptune_1 = require("../../Constructs/Neptune");
const Stack_1 = require("../../Constructs/Stack");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const fs = require("fs");
templating_1.Generator.generateFromModel({
    outputFile: `../../../../lib/${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const lambda = new Lambda_1.Lambda(output);
    const dynamoDB = new DynamoDB_1.DynamoDB(output);
    const neptune = new Neptune_1.Neptune(output);
    const aurora = new AuroraServerless_1.AuroraServerless(output);
    const appsync = new Appsync_1.Appsync(output);
    const ec2 = new Ec2_1.Ec2(output);
    const cdk = new Cdk_1.Cdk(output);
    const iam = new Iam_1.Iam(output);
    const manager = new ApiManager_1.apiManager(output);
    const cls = new Stack_1.BasicClass(output);
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
    if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
        dynamoDB.importDynamodb(output);
    }
    else if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
        ts.writeImports("aws-cdk-lib", ["Tags"]);
        neptune.importNeptune(output);
        ec2.importEc2(output);
    }
    else if (database === cloud_api_constants_1.DATABASE.auroraDb) {
        ts.writeImports("aws-cdk-lib", ["Duration"]);
        aurora.importRds(output);
        ec2.importEc2(output);
    }
    else {
        ts.writeLine();
    }
    cls.initializeClass(`${USER_WORKING_DIRECTORY}`, () => {
        var _a, _b, _c, _d;
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
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
            ec2.initializeVpc(apiName, output, `
          {
            cidrMask: 24, 
            name: 'Ingress',
            subnetType: ec2.SubnetType.ISOLATED,
          }`);
            ts.writeLine();
            ec2.initializeSecurityGroup(apiName, `${apiName}_vpc`, output);
            ts.writeLine();
            cdk.tagAdd(`${apiName}_sg`, "Name", `${apiName}SecurityGroup`);
            ts.writeLine();
            ec2.securityGroupAddIngressRule(apiName, `${apiName}_sg`);
            ts.writeLine();
        }
        else if (database === cloud_api_constants_1.DATABASE.auroraDb) {
            ec2.initializeVpc(apiName, output);
        }
        else {
            ts.writeLine();
        }
        if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
            dynamoDB.initializeDynamodb(apiName, output);
            ts.writeLine();
        }
        else if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
            neptune.initializeNeptuneSubnet(apiName, `${apiName}_vpc`, output);
            ts.writeLine();
            neptune.initializeNeptuneCluster(apiName, `${apiName}_neptuneSubnet`, `${apiName}_sg`, output);
            neptune.addDependsOn(`${apiName}_neptuneCluster`, `${apiName}_neptuneSubnet`);
            ts.writeLine();
            neptune.initializeNeptuneInstance(apiName, `${apiName}_vpc`, `${apiName}_neptuneCluster`, output);
            neptune.addDependsOn(`${apiName}_neptuneInstance`, `${apiName}_neptuneCluster`);
            ts.writeLine();
        }
        else if (database === cloud_api_constants_1.DATABASE.auroraDb) {
            aurora.initializeAuroraCluster(apiName, `${apiName}_vpc`, output);
            ts.writeLine();
            iam.serviceRoleForLambda(apiName, output, [
                "AmazonRDSDataFullAccess",
                "service-role/AWSLambdaVPCAccessExecutionRole",
            ]);
            ts.writeLine();
            ts.writeVariableDeclaration({
                name: `${apiName}_secret`,
                typeName: "",
                initializer: () => {
                    ts.writeLine(`${apiName}_db.secret?.secretArn || "secret"`);
                },
            }, "const");
            ts.writeLine();
            aurora.connectionsAllowFromAnyIpv4(`${apiName}_db`);
        }
        else {
            ts.writeLine();
        }
        if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
            if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
                lambda.initializeLambda(apiName, output, lambdaStyle, undefined, undefined, undefined, [{ name: "TABLE_NAME", value: `${apiName}_table.tableName` }]);
            }
            else if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
                lambda.initializeLambda(apiName, output, lambdaStyle, undefined, `${apiName}_vpc`, `${apiName}_sg`, [
                    {
                        name: "NEPTUNE_ENDPOINT",
                        value: `${apiName}_neptuneCluster.attrEndpoint`,
                    },
                ], `ec2.SubnetType.ISOLATED`);
            }
            else if (database === cloud_api_constants_1.DATABASE.auroraDb) {
                ts.writeLine();
                lambda.initializeLambda(apiName, output, lambdaStyle, undefined, `${apiName}_vpc`, undefined, [
                    {
                        name: "INSTANCE_CREDENTIALS",
                        value: `${apiName}_secret`,
                    },
                ], undefined, `${apiName}Lambda_serviceRole`);
            }
            else {
                ts.writeLine();
            }
        }
        else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
            if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    lambda.initializeLambda(apiName, output, lambdaStyle, key, undefined, undefined, [{ name: "TABLE_NAME", value: `${apiName}_table.tableName` }]);
                    ts.writeLine();
                });
            }
            else if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    lambda.initializeLambda(apiName, output, lambdaStyle, key, `${apiName}_vpc`, `${apiName}_sg`, [
                        {
                            name: "NEPTUNE_ENDPOINT",
                            value: `${apiName}_neptuneCluster.attrEndpoint`,
                        },
                    ], `ec2.SubnetType.ISOLATED`);
                    ts.writeLine();
                });
            }
            else if (database === cloud_api_constants_1.DATABASE.auroraDb) {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    lambda.initializeLambda(apiName, output, lambdaStyle, key, `${apiName}_vpc`, undefined, [
                        {
                            name: "INSTANCE_CREDENTIALS",
                            value: `${apiName}_secret`,
                        },
                    ], undefined, `${apiName}Lambda_serviceRole`);
                    ts.writeLine();
                });
            }
            else {
                ts.writeLine();
            }
        }
        else {
            ts.writeLine();
        }
        if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
            if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle);
            }
            else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle, key);
                    ts.writeLine();
                });
            }
        }
        if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
            appsync.appsyncLambdaDataSource(output, apiName, `${apiName}Appsync`, lambdaStyle);
        }
        else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
            Object.keys(mutationsAndQueries).forEach((key) => {
                appsync.appsyncLambdaDataSource(output, apiName, `${apiName}Appsync`, lambdaStyle, key);
                ts.writeLine();
            });
        }
        else {
            ts.writeLine();
        }
        if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
            for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
                if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                    appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}`, output);
                }
                else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                    appsync.appsyncLambdaResolver(key, "Query", `ds_${apiName}_${key}`, output);
                }
            }
            ts.writeLine();
        }
        if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
            for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
                if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
                    appsync.appsyncLambdaResolver(key, "Mutation", `ds_${apiName}`, output);
                }
                else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
                    appsync.appsyncLambdaResolver(key, "Mutation", `ds_${apiName}_${key}`, output);
                }
            }
            ts.writeLine();
        }
    }, output);
});
