"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const constant_1 = require("../../../constant");
const Cdk_1 = require("../../../Constructs/Cdk");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const functions_1 = require("./functions");
const model = require("../../../model.json");
templating_1.Generator.generate({
    outputFile: `${constant_1.PATH.construct}${constant_1.CONSTRUCTS.lambda}/index.ts`,
}, (output) => {
    const { apiName, lambdaStyle, database, apiType } = model.api;
    let mutations = {};
    let queries = {};
    if (apiType === constant_1.APITYPE.graphql) {
        mutations = model.type.Mutation ? model.type.Mutation : {};
        queries = model.type.Query ? model.type.Query : {};
    }
    const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
    let lambdaPropsWithName;
    let lambdaProps;
    let lambdaProperties;
    const cdk = new Cdk_1.Cdk(output);
    const imp = new ConstructsImports_1.Imports(output);
    imp.importsForStack(output);
    imp.importEc2(output);
    imp.importLambda(output);
    imp.importIam(output);
    if (database === constant_1.DATABASE.dynamo) {
        lambdaProps = [
            {
                name: "tableName",
                type: "string",
            },
        ];
        lambdaPropsWithName = "handlerProps";
        lambdaProperties = functions_1.lambdaProperiesHandlerForDynoDb(lambdaStyle, apiName, apiType, mutationsAndQueries);
    }
    if (database === constant_1.DATABASE.neptune) {
        lambdaPropsWithName = "handlerProps";
        lambdaProps = functions_1.lambdaPropsHandlerForNeptunedb();
        lambdaProperties = functions_1.lambdaProperiesHandlerForNeptuneDb(apiName, apiType, lambdaStyle, database, mutationsAndQueries);
    }
    if (database === constant_1.DATABASE.aurora) {
        lambdaPropsWithName = "handlerProps";
        lambdaProps = functions_1.lambdaPropsHandlerForAuroradb();
        lambdaProperties = functions_1.lambdaProperiesHandlerForAuroraDb(apiName, apiType, lambdaStyle, database, mutationsAndQueries);
    }
    cdk.initializeConstruct(constant_1.CONSTRUCTS.lambda, lambdaPropsWithName, () => {
        if (database === constant_1.DATABASE.dynamo) {
            functions_1.lambdaHandlerForDynamodb(output, apiName, apiType, lambdaStyle, database, mutationsAndQueries);
        }
        if (database === constant_1.DATABASE.neptune) {
            functions_1.lambdaHandlerForNeptunedb(output, lambdaStyle, database, apiType, apiName, mutationsAndQueries);
        }
        if (database === constant_1.DATABASE.aurora) {
            functions_1.lambdaHandlerForAuroradb(output, lambdaStyle, database, apiType, apiName, mutationsAndQueries);
        }
    }, output, lambdaProps, lambdaProperties);
});
