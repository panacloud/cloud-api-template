import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS } from "../../../cloud-api-constants";
import { ApiGateway } from "../../../Constructs/ApiGateway";
import { Cdk } from "../../../Constructs/Cdk";
const model = require("../../../model.json");

Generator.generateFromModel(
  {
    outputFile: `../../../../../lib/${CONSTRUCTS.apigateway}/index.ts`,
  },
  (output: TextWriter, model: any) => {
    const ts = new TypeScriptWriter(output);
    const cdk = new Cdk(output)
    const apigw = new ApiGateway(output);
    cdk.importsForStack(output);
    apigw.importApiGateway(output)

    const { apiName } = model.api;

    const props = [
        {
          name: `${apiName}_lambdaFn`,
          type: "lambda.Function",
        },
      ]

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
)