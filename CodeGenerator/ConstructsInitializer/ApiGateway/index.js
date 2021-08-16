"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const ApiGateway_1 = require("../../../Constructs/ApiGateway");
const Cdk_1 = require("../../../Constructs/Cdk");
const Lambda_1 = require("../../../Constructs/Lambda");
const model = require("../../../model.json");
const { apiName, apiType } = model.api;
if (apiType === cloud_api_constants_1.APITYPE.rest) {
    templating_1.Generator.generateFromModel({
        outputFile: `../../../../../lib/${cloud_api_constants_1.CONSTRUCTS.apigateway}/index.ts`,
    }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const cdk = new Cdk_1.Cdk(output);
        const lambda = new Lambda_1.Lambda(output);
        const apigw = new ApiGateway_1.ApiGateway(output);
        cdk.importsForStack(output);
        lambda.importLambda(output);
        apigw.importApiGateway(output);
        const props = [
            {
                name: `${apiName}_lambdaFn`,
                type: "lambda.Function",
            },
        ];
        cdk.initializeConstruct(`${cloud_api_constants_1.CONSTRUCTS.apigateway}`, "ApiGatewayProps", () => {
            apigw.initializeApiGateway(apiName, output);
            ts.writeLine();
        }, output, props);
    });
}
