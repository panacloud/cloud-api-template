"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Appsync_1 = require("../../../Constructs/Appsync");
const Cdk_1 = require("../../../Constructs/Cdk");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const Iam_1 = require("../../../Constructs/Iam");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const fs = require("fs");
if (((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.apiType) === cloud_api_constants_1.APITYPE.graphql) {
    templating_1.Generator.generate({
        outputFile: `../../../../../lib/${cloud_api_constants_1.CONSTRUCTS.appsync}/index.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const appsync = new Appsync_1.Appsync(output);
        const cdk = new Cdk_1.Cdk(output);
        const iam = new Iam_1.Iam(output);
        const imp = new ConstructsImports_1.Imports(output);
        const schema = fs.readFileSync(`../../../schema.graphql`).toString("utf8");
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
        const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
        const { apiName, lambdaStyle } = model.api;
        imp.importsForStack(output);
        imp.importAppsync(output);
        imp.importIam(output);
        let ConstructProps = [{
                name: `${apiName}_lambdaFnArn`,
                type: "string",
            }];
        if (lambdaStyle && lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
            Object.keys(mutationsAndQueries).forEach((key, index) => {
                ConstructProps[index] = {
                    name: `${apiName}_lambdaFn_${key}Arn`,
                    type: "string",
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
            functions_1.appsyncDatasourceHandler(apiName, output, lambdaStyle, mutationsAndQueries);
            ts.writeLine();
            functions_1.appsyncResolverhandler(apiName, output, lambdaStyle);
        }, output, ConstructProps);
    });
}
