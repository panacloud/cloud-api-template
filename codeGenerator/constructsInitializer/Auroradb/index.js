"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const AuroraServerless_1 = require("../../../Constructs/AuroraServerless");
const Cdk_1 = require("../../../Constructs/Cdk");
const Ec2_1 = require("../../../Constructs/Ec2");
const Iam_1 = require("../../../Constructs/Iam");
const function_1 = require("./function");
const model = require("../../../model.json");
const { database } = model.api;
if (database && database === cloud_api_constants_1.DATABASE.auroraDb) {
    templating_1.Generator.generateFromModel({ outputFile: `../../../../../lib/${cloud_api_constants_1.CONSTRUCTS.auroradb}/index.ts`, }, (output, model) => {
        const ts = new typescript_1.TypeScriptWriter(output);
        const { apiName, lambdaStyle, database } = model.api;
        const cdk = new Cdk_1.Cdk(output);
        const ec2 = new Ec2_1.Ec2(output);
        const aurora = new AuroraServerless_1.AuroraServerless(output);
        const iam = new Iam_1.Iam(output);
        const auroradbProperties = function_1.auroradbPropertiesHandler();
        cdk.importsForStack(output);
        iam.importIam(output);
        ts.writeImports("aws-cdk-lib", ["Duration"]);
        aurora.importRds(output);
        ec2.importEc2(output);
        ts.writeLine();
        cdk.initializeConstruct(cloud_api_constants_1.CONSTRUCTS.auroradb, undefined, () => {
            ec2.initializeVpc(apiName, output);
            ts.writeLine();
            aurora.initializeAuroraCluster(apiName, `${apiName}_vpc`, output);
            ts.writeLine();
            iam.serviceRoleForLambda(apiName, output, [
                "AmazonRDSDataFullAccess",
                "service-role/AWSLambdaVPCAccessExecutionRole",
            ]);
            ts.writeLine();
            ts.writeVariableDeclaration({
                name: `${apiName}_secret`,
                typeName: "",
                initializer: () => {
                    ts.writeLine(`${apiName}_db.secret?.secretArn || "secret"`);
                },
            }, "const");
            ts.writeLine();
            aurora.connectionsAllowFromAnyIpv4(`${apiName}_db`);
            ts.writeLine();
            function_1.auroradbPropertiesInitializer(output, apiName);
        }, output, undefined, auroradbProperties);
    });
}
