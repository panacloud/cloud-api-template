"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGateway = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class ApiGateway extends core_1.CodeWriter {
    constructor() {
        super(...arguments);
        this.apiEndpoint = "restApiEndpoint";
    }
    importApiGateway(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_apigateway as apigw"]);
    }
    initializeApiGateway(name, output) {
        this.apiEndpoint = name;
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: `${this.apiEndpoint}`,
            typeName: "apigw.LambdaRestApi",
            initializer: () => {
                ts.writeLine(`new apigw.LambdaRestApi(this,'${this.apiEndpoint}',{
                handler: props!.${name}_lambdaFn,
                defaultCorsPreflightOptions: {
                  allowOrigins: apigw.Cors.ALL_ORIGINS,
                  allowMethods: apigw.Cors.ALL_METHODS
                }
            })`);
            },
        }, "const");
    }
}
exports.ApiGateway = ApiGateway;
