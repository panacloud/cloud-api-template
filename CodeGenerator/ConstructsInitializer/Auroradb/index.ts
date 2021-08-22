import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, PATH } from "../../../cloud-api-constants";
import { AuroraServerless } from "../../../Constructs/AuroraServerless";
import { Cdk } from "../../../Constructs/Cdk";
import { Ec2 } from "../../../Constructs/Ec2";
import { Iam } from "../../../Constructs/Iam";
import {
  auroradbPropertiesHandler,
  auroradbPropertiesInitializer,
} from "./function";
const model = require("../../../model.json");
const { database } = model.api;

if (database && database === DATABASE.aurora) {
  Generator.generate(
    { outputFile: `${PATH.lib}${CONSTRUCTS.auroradb}/index.ts` },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const { apiName } = model.api;
      const cdk = new Cdk(output);
      const ec2 = new Ec2(output);
      const aurora = new AuroraServerless(output);
      const iam = new Iam(output);

      const auroradbProperties: PropertyDefinition[] =
        auroradbPropertiesHandler();
      cdk.importsForStack(output);
      iam.importIam(output);
      ts.writeImports("aws-cdk-lib", ["Duration"]);
      aurora.importRds(output);
      ec2.importEc2(output);
      ts.writeLine();

      cdk.initializeConstruct(
        CONSTRUCTS.auroradb,
        undefined,
        () => {
          ec2.initializeVpc(apiName, output);
          ts.writeLine();
          aurora.initializeAuroraCluster(apiName, `${apiName}_vpc`, output);
          ts.writeLine();
          iam.serviceRoleForLambda(apiName, output, [
            "AmazonRDSDataFullAccess",
            "service-role/AWSLambdaVPCAccessExecutionRole",
          ]);
          ts.writeLine();
          ts.writeVariableDeclaration(
            {
              name: `${apiName}_secret`,
              typeName: "",
              initializer: () => {
                ts.writeLine(`${apiName}_db.secret?.secretArn || "secret"`);
              },
            },
            "const"
          );
          ts.writeLine();
          aurora.connectionsAllowFromAnyIpv4(`${apiName}_db`);
          ts.writeLine();
          auroradbPropertiesInitializer(output, apiName);
        },
        output,
        undefined,
        auroradbProperties
      );
    }
  );
}
