"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Cdk_1 = require("../../../Constructs/Cdk");
const Lambda_1 = require("../../../Constructs/Lambda");
const functions_1 = require("./functions");
const model = require("../../../../model.json");
const { USER_WORKING_DIRECTORY } = model;
const { apiName, lambdaStyle, database } = model.api;
templating_1.Generator.generateFromModel({
    outputFile: `../../../../../lib/LambdaConstructs/index.ts`,
}, (output, model) => {
    const { apiName, lambdaStyle, database } = model.api;
    const mutations = model.type.Mutation ? model.type.Mutation : {};
    const queries = model.type.Query ? model.type.Query : {};
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    const lambda = new Lambda_1.Lambda(output);
    const cdk = new Cdk_1.Cdk(output);
    cdk.importsForStack(output);
    lambda.importLambda(output);
    let constructProperties = [{
            name: "mainHandler",
            typeName: "lambda.Function",
            accessModifier: "public"
        }];
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            constructProperties[index] = {
                name: `${key}Handler`,
                typeName: "lambda.Function",
                accessModifier: "public"
            };
        });
    }
    cdk.initializeConstruct(cloud_api_constants_1.CONSTRUCTS.lambda, undefined, () => {
        functions_1.lambdaHandlerForDynamodb(output);
    }, output, undefined, constructProperties);
});
