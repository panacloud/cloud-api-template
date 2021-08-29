"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../../utils/constant");
const ApiGateway_1 = require("../../../lib/ApiGateway");
const Cdk_1 = require("../../../lib/Cdk");
const ConstructsImports_1 = require("../../../lib/ConstructsImports");
const model = require("../../../../../model.json");
const { apiName, apiType } = model.api;
if (apiType === constant_1.APITYPE.rest) {
    templating_1.Generator.generate({
        outputFile: `${constant_1.PATH.construct}${constant_1.CONSTRUCTS.apigateway}/index.ts`,
    }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const cdk = new Cdk_1.Cdk(output);
        const imp = new ConstructsImports_1.Imports(output);
        const apigw = new ApiGateway_1.ApiGateway(output);
        imp.importsForStack(output);
        imp.importLambda(output);
        apigw.importApiGateway(output);
        const props = [
            {
                name: `${apiName}_lambdaFn`,
                type: "lambda.Function",
            },
        ];
        cdk.initializeConstruct(`${constant_1.CONSTRUCTS.apigateway}`, "ApiGatewayProps", () => {
            apigw.initializeApiGateway(apiName, output);
            ts.writeLine();
        }, output, props);
    });
}
