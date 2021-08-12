"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const ApiGateway_1 = require("../../../Constructs/ApiGateway");
const Cdk_1 = require("../../../Constructs/Cdk");
const model = require("../../../model.json");
templating_1.Generator.generateFromModel({
    outputFile: `../../../../../lib/${cloud_api_constants_1.CONSTRUCTS.apigateway}/index.ts`,
}, (output, model) => {
    const { apiName, apiType } = model.api;
    if (apiType === cloud_api_constants_1.APITYPE.rest) {
        const ts = new typescript_1.TypeScriptWriter(output);
        const cdk = new Cdk_1.Cdk(output);
        const apigw = new ApiGateway_1.ApiGateway(output);
        cdk.importsForStack(output);
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
    }
});
