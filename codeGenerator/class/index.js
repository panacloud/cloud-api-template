"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const api_manager_1 = require("../../functions/api-manager");
const Appsync_1 = require("../../functions/Appsync");
const dynamoDB_1 = require("../../functions/dynamoDB");
const iam_1 = require("../../functions/iam");
const lambda_1 = require("../../functions/lambda");
const class_1 = require("../../functions/utils/class");
const model = require("../../model.json");
const { USER_WORKING_DIRECTORY, API_NAME, LAMBDA_STYLE } = model;
const fs = require("fs");
templating_1.Generator.generateFromModel({
    outputFile: `../../../${USER_WORKING_DIRECTORY}/lib/${USER_WORKING_DIRECTORY}-stack.ts`,
}, (output, model) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    const lambda = new lambda_1.Lambda(output);
    const db = new dynamoDB_1.DynamoDB(output);
    const appsync = new Appsync_1.Appsync(output);
    const iam = new iam_1.Iam(output);
    const manager = new api_manager_1.apiManager(output);
    const cls = new class_1.BasicClass(output);
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
    cls.initializeClass(`${USER_WORKING_DIRECTORY}`, () => {
        var _a, _b, _c, _d;
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
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        // console.log(mutationsAndQueries);
        if (LAMBDA_STYLE === "single lambda") {
            lambda.initializeLambda(API_NAME, output, LAMBDA_STYLE, "", "vpc", "sg", [
                {
                    name: "NEPTUNE_ENDPOINT",
                    value: "neptuneCluster.attrEndpoint",
                },
                {
                    name: "NEPTUNE_ENDPOINT",
                    value: "neptuneCluster.attrEndpoint",
                },
            ], "ddhdi");
        }
        else if (LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                lambda.initializeLambda(API_NAME, output, LAMBDA_STYLE, key);
                ts.writeLine();
            });
        }
        if (LAMBDA_STYLE === "single lambda") {
            appsync.appsyncDataSource(output, API_NAME, API_NAME, LAMBDA_STYLE);
        }
        else if (LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                appsync.appsyncDataSource(output, API_NAME, API_NAME, LAMBDA_STYLE, key);
                ts.writeLine();
            });
        }
        db.initializeDynamodb(API_NAME, output);
        ts.writeLine();
        if (LAMBDA_STYLE === "single lambda") {
            db.grantFullAccess(`${API_NAME}`, `${API_NAME}_table`, LAMBDA_STYLE);
        }
        else if (LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                db.grantFullAccess(`${API_NAME}`, `${API_NAME}_table`, LAMBDA_STYLE, key);
                ts.writeLine();
            });
        }
        if ((_a = model === null || model === void 0 ? void 0 : model.type) === null || _a === void 0 ? void 0 : _a.Query) {
            for (var key in (_b = model === null || model === void 0 ? void 0 : model.type) === null || _b === void 0 ? void 0 : _b.Query) {
                if (LAMBDA_STYLE === "single lambda") {
                    appsync.lambdaDataSourceResolver(key, "Query", `ds_${API_NAME}`);
                }
                else if (LAMBDA_STYLE === "multiple lambda") {
                    appsync.lambdaDataSourceResolver(key, "Query", `ds_${API_NAME}_${key}`);
                }
            }
            ts.writeLine();
        }
        if ((_c = model === null || model === void 0 ? void 0 : model.type) === null || _c === void 0 ? void 0 : _c.Mutation) {
            for (var key in (_d = model === null || model === void 0 ? void 0 : model.type) === null || _d === void 0 ? void 0 : _d.Mutation) {
                if (LAMBDA_STYLE === "single lambda") {
                    appsync.lambdaDataSourceResolver(key, "Mutation", `ds_${API_NAME}`);
                }
                else if (LAMBDA_STYLE === "multiple lambda") {
                    appsync.lambdaDataSourceResolver(key, "Mutation", `ds_${API_NAME}_${key}`);
                }
            }
            ts.writeLine();
        }
        if (LAMBDA_STYLE === "single lambda") {
            lambda.addEnvironment(`${API_NAME}`, `${API_NAME}_TABLE`, `${API_NAME}_table.tableName`, LAMBDA_STYLE);
        }
        else if (LAMBDA_STYLE === "multiple lambda") {
            Object.keys(mutationsAndQueries).forEach((key) => {
                lambda.addEnvironment(`${API_NAME}`, `${API_NAME}_TABLE`, `${API_NAME}_table.tableName`, LAMBDA_STYLE, `${key}`);
                ts.writeLine();
            });
        }
    }, output);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHNEQUFrRDtBQUNsRCxzREFBeUQ7QUFDekQsNkRBQXlEO0FBQ3pELHFEQUFrRDtBQUNsRCx1REFBb0Q7QUFDcEQsNkNBQTBDO0FBQzFDLG1EQUFnRDtBQUNoRCx1REFBeUQ7QUFDekQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUMsTUFBTSxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDakUsTUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBRXpCLHNCQUFTLENBQUMsaUJBQWlCLENBQ3pCO0lBQ0UsVUFBVSxFQUFFLFlBQVksc0JBQXNCLFFBQVEsc0JBQXNCLFdBQVc7Q0FDeEYsRUFDRCxDQUFDLE1BQWtCLEVBQUUsS0FBVSxFQUFFLEVBQUU7SUFDakMsTUFBTSxFQUFFLEdBQUcsSUFBSSw2QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxNQUFNLEVBQUUsR0FBRyxJQUFJLG1CQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsTUFBTSxPQUFPLEdBQUcsSUFBSSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sR0FBRyxHQUFHLElBQUksU0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQzVCLE1BQU0sT0FBTyxHQUFHLElBQUksd0JBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkMsTUFBTSxNQUFNLEdBQUcsRUFBRTtTQUNkLFlBQVksQ0FBQyxZQUFZLHNCQUFzQix5QkFBeUIsQ0FBQztT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