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
            appsync.appsyncDataSource(output, apiName, `${apiName}Appsync`, lambdaStyle);
        }
        else if (lambdaStyle === "multiple") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                appsync.appsyncDataSource(output, apiName, `${apiName}Appsync`, lambdaStyle, key);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHNEQUFrRDtBQUNsRCxzREFBeUQ7QUFDekQsNkRBQXlEO0FBQ3pELHFEQUFrRDtBQUNsRCx1REFBb0Q7QUFDcEQscURBQWtEO0FBQ2xELHVFQUFvRTtBQUNwRSw2Q0FBMEM7QUFDMUMsNkNBQTBDO0FBQzFDLDZDQUEwQztBQUMxQyxtREFBZ0Q7QUFDaEQsdURBQXlEO0FBQ3pELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzFDLE1BQU0sRUFBRSxzQkFBc0IsRUFBRSxHQUFHLEtBQUssQ0FBQztBQUN6QyxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFekIsc0JBQVMsQ0FBQyxpQkFBaUIsQ0FDekI7SUFDRSxVQUFVLEVBQUUsWUFBWSxzQkFBc0IsUUFBUSxzQkFBc0IsV0FBVztDQUN4RixFQUNELENBQUMsTUFBa0IsRUFBRSxLQUFVLEVBQUUsRUFBRTtJQUNqQyxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLE1BQU0sUUFBUSxHQUFHLElBQUksbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDNUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxTQUFHLENB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