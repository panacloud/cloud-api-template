"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appsync = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class Appsync extends core_1.CodeWriter {
    initializeAppsync(name) {
        this
            .writeLineIndented(` const api = new appsync.GraphqlApi(this, "${name}", {
            name: "${name}",
            schema: appsync.Schema.fromAsset("graphql/schema.graphql"),
            authorizationConfig: {
              defaultAuthorization: {
                authorizationType: appsync.AuthorizationType.API_KEY,
              },
            },
            xrayEnabled: true,
          });`);
    }
    importAppsync(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("@aws-cdk/aws-appsync", "appsync");
    }
    lambdaDataSource(name, lambda) {
        this.writeLine(`const lambdaDs = api.addLambdaDataSource("${name}", ${lambda})`);
    }
    lambdaDataSourceResolverQuery(value) {
        this.writeLineIndented(` lambdaDs.createResolver({
      typeName: "Query",
      fieldName: "${value}",
    });`);
    }
    lambdaDataSourceResolverMutation(value) {
        this.writeLineIndented(` lambdaDs.createResolver({
      typeName: "Mutation",
      fieldName: "${value}",
    });`);
    }
}
exports.Appsync = Appsync;
