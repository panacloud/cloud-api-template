"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const constant_1 = require("../../../constant");
const Cdk_1 = require("../../../Constructs/Cdk");
const ConstructsImports_1 = require("../../../Constructs/ConstructsImports");
const functions_1 = require("./functions");
const model = require("../../../model.json");
<<<<<<< HEAD
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
=======
const { lambdaStyle, database } = model.api;
templating_1.Generator.generate({
    outputFile: `${constant_1.PATH.construct}${constant_1.CONSTRUCTS.lambda}/index.ts`,
}, (output) => {
    const lambda = new Lambda_1.Lambda(output);
    let lambdaPropsWithName;
    let lambdaProps;
    let lambdaProperties;
    const cdk = new Cdk_1.Cdk(output);
    const iam = new Iam_1.Iam(output);
    const ec2 = new Ec2_1.Ec2(output);
    cdk.importsForStack(output);
    ec2.importEc2(output);
    lambda.importLambda(output);
    iam.importIam(output);
    if (database === constant_1.DATABASE.dynamo) {
        lambdaProps = [
            {
                name: "tableName",
                type: "string",
            },
        ];
        lambdaPropsWithName = "handlerProps";
        lambdaProperties = functions_1.lambdaProperiesHandlerForDynoDb(output);
    }
    if (database === constant_1.DATABASE.neptune) {
        lambdaPropsWithName = "handlerProps";
        lambdaProps = functions_1.lambdaPropsHandlerForNeptunedb();
        lambdaProperties = functions_1.lambdaProperiesHandlerForNeptuneDb(output);
    }
    if (database === constant_1.DATABASE.aurora) {
        lambdaPropsWithName = "handlerProps";
        lambdaProps = functions_1.lambdaPropsHandlerForAuroradb();
        lambdaProperties = functions_1.lambdaProperiesHandlerForAuroraDb(output);
    }
    cdk.initializeConstruct(constant_1.CONSTRUCTS.lambda, lambdaPropsWithName, () => {
        if (database === constant_1.DATABASE.dynamo) {
            functions_1.lambdaHandlerForDynamodb(output);
        }
        if (database === constant_1.DATABASE.neptune) {
            functions_1.lambdaHandlerForNeptunedb(output, lambdaStyle, database);
        }
        if (database === constant_1.DATABASE.aurora) {
            functions_1.lambdaHandlerForAuroradb(output, lambdaStyle, database);
>>>>>>> dev
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
