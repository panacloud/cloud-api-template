"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const api_manager_1 = require("../../functions/api-manager");
const Appsync_1 = require("../../functions/Appsync");
const dynamoDB_1 = require("../../functions/dynamoDB");
const neptune_1 = require("../../functions/neptune");
const auroraServerless_1 = require("../../functions/auroraServerless");
const iam_1 = require("../../functions/iam");
const ec2_1 = require("../../functions/ec2");
const cdk_1 = require("../../functions/cdk");
const secretsManager_1 = require("../../functions/secretsManager");
const lambda_1 = require("../../functions/lambda");
const class_1 = require("../../functions/utils/class");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const fs = require("fs");
templating_1.Generator.generateFromModel({
    outputFile: `../../../${USER_WORKING_DIRECTORY}/lib/${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const lambda = new lambda_1.Lambda(output);
    const dynamoDB = new dynamoDB_1.DynamoDB(output);
    const neptune = new neptune_1.Neptune(output);
    const aurora = new auroraServerless_1.AuroraServerless(output);
    const appsync = new Appsync_1.Appsync(output);
    const ec2 = new ec2_1.Ec2(output);
    const cdk = new cdk_1.Cdk(output);
    const iam = new iam_1.Iam(output);
    const sm = new secretsManager_1.SecretsManager(output);
    const manager = new api_manager_1.apiManager(output);
    const cls = new class_1.BasicClass(output);
    const schema = fs
        .readFileSync(`../../../${USER_WORKING_DIRECTORY}/graphql/schema.graphql`)
        .toString("utf8");
    const { apiName, lambdaStyle, database } = model.api;
    ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
    ts.writeImports("constructs", ["Construct"]);
    appsync.importAppsync(output);
    manager.importApiManager(output);
    lambda.importLambda(output);
    iam.importIam(output);
    if (database === "DynamoDB") {
        dynamoDB.importDynamodb(output);
    }
    else if (database === "Neptune") {
        ts.writeImports("aws-cdk-lib", ["Tags"]);
        neptune.importNeptune(output);
        ec2.importEc2(output);
    }
    else if (database === "AuroraServerless") {
        ts.writeImports("aws-cdk-lib", ["Duration"]);
        aurora.importRds(output);
        ec2.importEc2(output);
        sm.importSecretsManager(output);
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
        iam.attachLambdaPolicyToRole(apiName);
        ts.writeLine();
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        if (database === "Neptune") {
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
        else if (database === "AuroraServerless") {
            ec2.initializeVpc(apiName, output);
        }
        else {
            ts.writeLine();
        }
        if (database === "DynamoDB") {
            dynamoDB.initializeDynamodb(apiName, output);
            ts.writeLine();
        }
        else if (database === "Neptune") {
            neptune.initializeNeptuneSubnet(apiName, `${apiName}_vpc`, output);
            ts.writeLine();
            neptune.initializeNeptuneCluster(apiName, `${apiName}_neptuneSubnet`, `${apiName}_sg`, output);
            neptune.addDependsOn(`${apiName}_neptuneCluster`, `${apiName}_neptuneSubnet`);
            ts.writeLine();
            neptune.initializeNeptuneInstance(apiName, `${apiName}_vpc`, `${apiName}_neptuneCluster`, output);
            neptune.addDependsOn(`${apiName}_neptuneInstance`, `${apiName}_neptuneCluster`);
            ts.writeLine();
        }
        else if (database === "AuroraServerless") {
            aurora.initializeAuroraCluster(apiName, `${apiName}_vpc`, output);
            ts.writeLine();
            iam.serviceRoleForLambda(apiName, output, [
                "AmazonRDSDataFullAccess",
                "service-role/AWSLambdaVPCAccessExecutionRole",
            ]);
            ts.writeLine();
            aurora.connectionsAllowFromAnyIpv4(`${apiName}_db`);
        }
        else {
            ts.writeLine();
        }
        if (lambdaStyle === "single") {
            if (database === "DynamoDB") {
                lambda.initializeLambda(apiName, output, lambdaStyle, undefined, undefined, undefined, [{ name: "TABLE_NAME", value: `${apiName}_table.tableName` }]);
            }
            else if (database === "Neptune") {
                lambda.initializeLambda(apiName, output, lambdaStyle, undefined, `${apiName}_vpc`, `${apiName}_sg`, [
                    {
                        name: "NEPTUNE_ENDPOINT",
                        value: `${apiName}_neptuneCluster.attrEndpoint`,
                    },
                ], `ec2.SubnetType.ISOLATED`);
            }
            else if (database === "AuroraServerless") {
                lambda.initializeLambda(apiName, output, lambdaStyle, undefined, `${apiName}_vpc`, undefined, [
                    {
                        name: "INSTANCE_CREDENTIALS",
                        value: `${sm.fromSecretAttributes(`${apiName}_db.secret?.secretArn`)}`,
                    },
                ], undefined, `${apiName}__serviceRole`);
            }
            else {
                ts.writeLine();
            }
        }
        else if (lambdaStyle === "multiple") {
            if (database === "DynamoDB") {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    lambda.initializeLambda(apiName, output, lambdaStyle, key, undefined, undefined, [{ name: "TABLE_NAME", value: `${apiName}_table.tableName` }]);
                    ts.writeLine();
                });
            }
            else if (database === "Neptune") {
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
            else if (database === "AuroraServerless") {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    lambda.initializeLambda(apiName, output, lambdaStyle, key, `${apiName}_vpc`, undefined, [
                        {
                            name: "INSTANCE_CREDENTIALS",
                            value: `${sm.fromSecretAttributes(`${apiName}_db.secret?.secretArn`)}`,
                        },
                    ], undefined, `${apiName}__serviceRole`);
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
        if (database === "DynamoDB") {
            if (lambdaStyle === "single") {
                dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle);
            }
            else if (lambdaStyle === "multiple") {
                Object.keys(mutationsAndQueries).forEach((key) => {
                    dynamoDB.grantFullAccess(`${apiName}`, `${apiName}_table`, lambdaStyle, key);
                    ts.writeLine();
                });
            }
        }
        if (lambdaStyle === "single") {
            appsync.appsyncDataSource(output, apiName, apiName, lambdaStyle);
        }
        else if (lambdaStyle === "multiple") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                appsync.appsyncDataSource(output, apiName, apiName, lambdaStyle, key);
                ts.writeLine();
            });
        }
        else {
            ts.writeLine();
        }
        if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
            for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
                if (lambdaStyle === "single") {
                    appsync.lambdaDataSourceResolver(key, "Query", `ds_${apiName}`);
                }
                else if (lambdaStyle === "multiple") {
                    appsync.lambdaDataSourceResolver(key, "Query", `ds_${apiName}_${key}`);
                }
            }
            ts.writeLine();
        }
        if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
            for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
                if (lambdaStyle === "single") {
                    appsync.lambdaDataSourceResolver(key, "Mutation", `ds_${apiName}`);
                }
                else if (lambdaStyle === "multiple") {
                    appsync.lambdaDataSourceResolver(key, "Mutation", `ds_${apiName}_${key}`);
                }
            }
            ts.writeLine();
        }
    }, output);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHNEQUFrRDtBQUNsRCxzREFBeUQ7QUFDekQsNkRBQXlEO0FBQ3pELHFEQUFrRDtBQUNsRCx1REFBb0Q7QUFDcEQscURBQWtEO0FBQ2xELHVFQUFvRTtBQUNwRSw2Q0FBMEM7QUFDMUMsNkNBQTBDO0FBQzFDLDZDQUEwQztBQUMxQyxtRUFBZ0U7QUFDaEUsbURBQWdEO0FBQ2hELHVEQUF5RDtBQUN6RCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUMxQyxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDekMsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXpCLHNCQUFTLENBQUMsaUJBQWlCLENBQ3pCO0lBQ0UsVUFBVSxFQUFFLFlBQVksc0JBQXNCLFFBQVEsc0JBQXNCLFdBQVc7Q0FDeEYsRUFDRCxDQUFDLE1BQWtCLEVBQUUsS0FBVSxFQUFFLEVBQUU7SUFDakMsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxNQUFNLFFBQVEsR0FBRyxJQUFJLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sTUFBTSxHQUFHLElBQUksbUNBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLE1BQU0sR0FBRyxHQUFH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