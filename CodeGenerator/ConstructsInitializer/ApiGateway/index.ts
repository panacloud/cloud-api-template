import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { APITYPE, CONSTRUCTS } from "../../../cloud-api-constants";
import { ApiGateway } from "../../../Constructs/ApiGateway";
import { Cdk } from "../../../Constructs/Cdk";
import { Lambda } from "../../../Constructs/Lambda";
const model = require("../../../model.json");
const { apiName, apiType } = model.api;

if (apiType === APITYPE.rest) {
  Generator.generateFromModel(
    {
      outputFile: `../../../../../lib/${CONSTRUCTS.apigateway}/index.ts`,
    },
    (output: TextWriter, model: any) => {
      const ts = new TypeScriptWriter(output);
      const cdk = new Cdk(output);
      const lambda = new Lambda(output);
      const apigw = new ApiGateway(output);
      cdk.importsForStack(output);
      lambda.importLambda(output);
      apigw.importApiGateway(output);

      const props = [
        {
          name: `${apiName}_lambdaFn`,
          type: "lambda.Function",
        },
      ];

      cdk.initializeConstruct(
        `${CONSTRUCTS.apigateway}`,
        "ApiGatewayProps",
        () => {
          apigw.initializeApiGateway(apiName, output);
          ts.writeLine();
        },
        output,
        props
      );
    }
  );
}
