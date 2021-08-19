"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Cdk_1 = require("../../../Constructs/Cdk");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const functions_1 = require("./functions");
const model = require("../../../model.json");
if ((_a = model === null || model === void 0 ? void 0 : model.api) === null || _a === void 0 ? void 0 : _a.lambdaStyle) {
    templating_1.Generator.generateFromModel({
        outputFile: `../../../../../lib/${cloud_api_constants_1.CONSTRUCTS.lambda}/index.ts`,
    }, (output, model) => {
        const { apiName, lambdaStyle, database } = model.api;
        const mutations = model.type.Mutation ? model.type.Mutation : {};
        const queries = model.type.Query ? model.type.Query : {};
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
        if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
            lambdaProps = [{
                    name: "tableName",
                    type: "string"
                }];
            lambdaPropsWithName = "handlerProps";
            lambdaProperties = functions_1.lambdaProperiesHandlerForDynoDb(lambdaStyle, apiName, mutationsAndQueries);
        }
        if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
            lambdaPropsWithName = "handlerProps";
            lambdaProps = functions_1.lambdaPropsHandlerForNeptunedb();
            lambdaProperties = functions_1.lambdaProperiesHandlerForNeptuneDb(apiName, lambdaStyle, database, mutationsAndQueries);
        }
        if (database === cloud_api_constants_1.DATABASE.auroraDb) {
            lambdaPropsWithName = "handlerProps";
            lambdaProps = functions_1.lambdaPropsHandlerForAuroradb();
            lambdaProperties = functions_1.lambdaProperiesHandlerForAuroraDb(apiName, lambdaStyle, database, mutationsAndQueries);
        }
        cdk.initializeConstruct(cloud_api_constants_1.CONSTRUCTS.lambda, lambdaPropsWithName, () => {
            if (database === cloud_api_constants_1.DATABASE.dynamoDb) {
                functions_1.lambdaHandlerForDynamodb(output, apiName, lambdaStyle, database, mutationsAndQueries);
            }
            if (database === cloud_api_constants_1.DATABASE.neptuneDb) {
                functions_1.lambdaHandlerForNeptunedb(output, apiName, lambdaStyle, database, mutationsAndQueries);
            }
            if (database === cloud_api_constants_1.DATABASE.auroraDb) {
                functions_1.lambdaHandlerForAuroradb(output, apiName, lambdaStyle, database, mutationsAndQueries);
            }
        }, output, lambdaProps, lambdaProperties);
    });
}
