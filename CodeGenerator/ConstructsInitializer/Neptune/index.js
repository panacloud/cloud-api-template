"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Cdk_1 = require("../../../Constructs/Cdk");
const Ec2_1 = require("../../../Constructs/Ec2");
const Iam_1 = require("../../../Constructs/Iam");
const Neptune_1 = require("../../../Constructs/Neptune");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const { database } = model.api;
if (database && database === cloud_api_constants_1.DATABASE.neptune) {
    templating_1.Generator.generate({ outputFile: `${cloud_api_constants_1.PATH.lib}${cloud_api_constants_1.CONSTRUCTS.neptuneDb}/index.ts` }, (output) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const { apiName } = model.api;
        const cdk = new Cdk_1.Cdk(output);
        const ec2 = new Ec2_1.Ec2(output);
        const neptune = new Neptune_1.Neptune(output);
        const iam = new Iam_1.Iam(output);
        cdk.importsForStack(output);
        ts.writeImports("aws-cdk-lib", ["Tags"]);
        neptune.importNeptune(output);
        ec2.importEc2(output);
        ts.writeLine();
        const propertiesForNeptuneDbConstruct = [
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
        cdk.initializeConstruct(cloud_api_constants_1.CONSTRUCTS.neptuneDb, undefined, () => {
            ec2.initializeVpc(apiName, output, `
                {
                  cidrMask: 24, 
                  name: 'Ingress',
                  subnetType: ec2.SubnetType.ISOLATED,
                }`);
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
            neptune.initializeNeptuneCluster(apiName, `${apiName}_neptuneSubnet`, `${apiName}_sg`, output);
            ts.writeLine();
            neptune.addDependsOn(`${apiName}_neptuneSubnet`, `${apiName}_neptuneCluster`);
            ts.writeLine();
            cdk.nodeAddDependency(`${apiName}_neptuneCluster`, `${apiName}_vpc`);
            ts.writeLine();
            neptune.initializeNeptuneInstance(apiName, `${apiName}_vpc`, `${apiName}_neptuneCluster`, output);
            ts.writeLine();
            neptune.addDependsOn(`${apiName}_neptuneCluster`, `${apiName}_neptuneInstance`);
            ts.writeLine();
            cdk.nodeAddDependency(`${apiName}_neptuneInstance`, `${apiName}_vpc`);
            cdk.nodeAddDependency(`${apiName}_neptuneInstance`, `${apiName}_neptuneSubnet`);
            ts.writeLine();
            functions_1.neptunePropertiesInitializer(output, apiName);
        }, output, undefined, propertiesForNeptuneDbConstruct);
    });
}
