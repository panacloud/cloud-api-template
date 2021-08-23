import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { TypeScriptWriter } from "@yellicode/typescript";
import { APITYPE, CONSTRUCTS, PATH } from "../../../constant";
import { ApiGateway } from "../../../Constructs/ApiGateway";
import { Cdk } from "../../../Constructs/Cdk";
import { Imports } from "../../../Constructs/ConstructsImports";
import { Lambda } from "../../../Constructs/Lambda";
const model = require("../../../model.json");
const { apiName, apiType } = model.api;

if (apiType === APITYPE.rest) {
  Generator.generate(
    {
      outputFile: `${PATH.construct}${CONSTRUCTS.apigateway}/index.ts`,
    },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const cdk = new Cdk(output);
      const lambda = new Lambda(output);
      const imp = new Imports(output)
      const apigw = new ApiGateway(output);
      imp.importsForStack(output);
      imp.importLambda(output);
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
