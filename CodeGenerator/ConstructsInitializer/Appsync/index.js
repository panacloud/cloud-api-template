"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../../constant");
const Appsync_1 = require("../../../Constructs/Appsync");
const Cdk_1 = require("../../../Constructs/Cdk");
const Iam_1 = require("../../../Constructs/Iam");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { apiType } = model.api;
const fs = require("fs");
if (apiType === constant_1.APITYPE.graphql) {
    templating_1.Generator.generate({
        outputFile: `${constant_1.PATH.lib}${constant_1.CONSTRUCTS.appsync}/index.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const appsync = new Appsync_1.Appsync(output);
        const cdk = new Cdk_1.Cdk(output);
        const iam = new Iam_1.Iam(output);
        const schema = fs
            .readFileSync(`../../../schema.graphql`)
            .toString("utf8");
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        const { apiName, lambdaStyle, database } = model.api;
        cdk.importsForStack(output);
        appsync.importAppsync(output);
        iam.importIam(output);
        let ConstructProps = [
            {
                name: `${apiName}_lambdaFnArn`,
                type: "string",
            },
        ];
        if (lambdaStyle && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
            Object.keys(mutationsAndQueries).forEach((key, index) => {
                ConstructProps[index] = {
                    name: `${apiName}_lambdaFn_${key}Arn`,
                    type: "string",
                };
            });
        }
        cdk.initializeConstruct(`${constant_1.CONSTRUCTS.appsync}`, "AppsyncProps", () => {
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
            functions_1.appsyncDatasourceHandler(apiName, output);
            ts.writeLine();
            functions_1.appsyncResolverhandler(apiName, output);
        }, output, ConstructProps);
    });
}
