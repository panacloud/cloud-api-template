import { CodeWriter, TextWriter } from "@yellicode/core";
import { TypeScriptWriter } from "@yellicode/typescript";

export class ApiGateway extends CodeWriter {
    public apiEndpoint: string = "restApiEndpoint"

    public importApiGateway(output: TextWriter) {
        const ts = new TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_apigateway as apigw"]);
    }

    public initializeApiGateway(name: string, output: TextWriter) {
        this.apiEndpoint = name;
        const ts = new TypeScriptWriter(output);
        ts.writeVariableDeclaration(
          {
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
          },
          "const"
        );
    }
}