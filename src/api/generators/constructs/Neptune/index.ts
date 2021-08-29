import { TextWriter } from "@yellicode/core";
import { Generator } from "@yellicode/templating";
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS, DATABASE, PATH } from "../../../utils/constant";
import { Cdk } from "../../../lib/Cdk";
import { Imports } from "../../../lib/ConstructsImports";
import { Ec2 } from "../../../lib/Ec2";
import { Neptune } from "../../../lib/Neptune";
import { neptunePropertiesInitializer } from "./functions";
const model = require("../../../model.json");
const { database } = model.api;

if (database && database === DATABASE.neptune) {
  Generator.generate(
    { outputFile: `${PATH.construct}${CONSTRUCTS.neptuneDb}/index.ts` },
    (output: TextWriter) => {
      const ts = new TypeScriptWriter(output);
      const { apiName } = model.api;
      const cdk = new Cdk(output);
      const ec2 = new Ec2(output);
      const neptune = new Neptune(output);
      const imp = new Imports(output);
      imp.importsForStack(output);
      ts.writeImports("aws-cdk-lib", ["Tags"]);
      imp.importNeptune(output);
      imp.importEc2(output);
      ts.writeLine();

      const propertiesForNeptuneDbConstruct: PropertyDefinition[] = [
        {
          name: "VPCRef",
          typeName: "ec2.Vpc",
          accessModifier: "public",
          isReadonly: true,
        },
        {
          name: "SGRef",
          typeName: "ec2.SecurityGroup",
          accessModifier: "public",
          isReadonly: true,
        },
        {
          name: "neptuneReaderEndpoint",
          typeName: "string",
          accessModifier: "public",
          isReadonly: true,
        },
      ];
      cdk.initializeConstruct(
        CONSTRUCTS.neptuneDb,
        undefined,
        () => {
          ec2.initializeVpc(
            apiName,
            output,
            `
                {
                  cidrMask: 24, 
                  name: 'Ingress',
                  subnetType: ec2.SubnetType.ISOLATED,
                }`
          );
          ts.writeLine();
          ec2.initializeSecurityGroup(apiName, `${apiName}_vpc`, output);
          ts.writeLine();
          cdk.tagAdd(`${apiName}_sg`, "Name", `${apiName}SecurityGroup`);
          ts.writeLine();
          cdk.nodeAddDependency(`${apiName}_sg`, `${apiName}_vpc`);
          ts.writeLine();
          ec2.securityGroupAddIngressRule(apiName, `${apiName}_sg`);
          ts.writeLine();
          neptune.initializeNeptuneSubnet(apiName, `${apiName}_vpc`, output);
          ts.writeLine();
          cdk.nodeAddDependency(`${apiName}_neptuneSubnet`, `${apiName}_vpc`);
          cdk.nodeAddDependency(`${apiName}_neptuneSubnet`, `${apiName}_sg`);
          neptune.initializeNeptuneCluster(
            apiName,
            `${apiName}_neptuneSubnet`,
            `${apiName}_sg`,
            output
          );
          ts.writeLine();
          neptune.addDependsOn(
            `${apiName}_neptuneSubnet`,
            `${apiName}_neptuneCluster`
          );
          ts.writeLine();
          cdk.nodeAddDependency(`${apiName}_neptuneCluster`, `${apiName}_vpc`);
          ts.writeLine();
          neptune.initializeNeptuneInstance(
            apiName,
            `${apiName}_vpc`,
            `${apiName}_neptuneCluster`,
            output
          );
          ts.writeLine();
          neptune.addDependsOn(
            `${apiName}_neptuneCluster`,
            `${apiName}_neptuneInstance`
          );
          ts.writeLine();
          cdk.nodeAddDependency(`${apiName}_neptuneInstance`, `${apiName}_vpc`);
          cdk.nodeAddDependency(
            `${apiName}_neptuneInstance`,
            `${apiName}_neptuneSubnet`
          );
          ts.writeLine();
          neptunePropertiesInitializer(output, apiName);
        },
        output,
        undefined,
        propertiesForNeptuneDbConstruct
      );
    }
  );
}
