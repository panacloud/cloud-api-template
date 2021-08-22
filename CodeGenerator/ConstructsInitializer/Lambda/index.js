"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const cloud_api_constants_1 = require("../../../cloud-api-constants");
const Cdk_1 = require("../../../Constructs/Cdk");
const Ec2_1 = require("../../../Constructs/Ec2");
const Iam_1 = require("../../../Constructs/Iam");
const Lambda_1 = require("../../../Constructs/Lambda");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const { lambdaStyle, database } = model.api;
templating_1.Generator.generate({
    outputFile: `${cloud_api_constants_1.PATH.lib}${cloud_api_constants_1.CONSTRUCTS.lambda}/index.ts`,
}, (output) => {
    const lambda = new Lambda_1.Lambda(output);
    let lambdaPropsWithName;
    let lambdaProps;
    let lambdaProperties;
    const cdk = new Cdk_1.Cdk(output);
    const iam = new Iam_1.Iam(output);
    const ec2 = new Ec2_1.Ec2(output);
    cdk.importsForStack(output);
    ec2.importEc2(output);
    lambda.importLambda(output);
    iam.importIam(output);
    if (database === cloud_api_constants_1.DATABASE.dynamo) {
        lambdaProps = [
            {
                name: "tableName",
                type: "string",
            },
        ];
        lambdaPropsWithName = "handlerProps";
        lambdaProperties = functions_1.lambdaProperiesHandlerForDynoDb(output);
    }
    if (database === cloud_api_constants_1.DATABASE.neptune) {
        lambdaPropsWithName = "handlerProps";
        lambdaProps = functions_1.lambdaPropsHandlerForNeptunedb();
        lambdaProperties = functions_1.lambdaProperiesHandlerForNeptuneDb(output);
    }
    if (database === cloud_api_constants_1.DATABASE.aurora) {
        lambdaPropsWithName = "handlerProps";
        lambdaProps = functions_1.lambdaPropsHandlerForAuroradb();
        lambdaProperties = functions_1.lambdaProperiesHandlerForAuroraDb(output);
    }
    cdk.initializeConstruct(cloud_api_constants_1.CONSTRUCTS.lambda, lambdaPropsWithName, () => {
        if (database === cloud_api_constants_1.DATABASE.dynamo) {
            functions_1.lambdaHandlerForDynamodb(output);
        }
        if (database === cloud_api_constants_1.DATABASE.neptune) {
            functions_1.lambdaHandlerForNeptunedb(output, lambdaStyle, database);
        }
        if (database === cloud_api_constants_1.DATABASE.aurora) {
            functions_1.lambdaHandlerForAuroradb(output, lambdaStyle, database);
        }
    }, output, lambdaProps, lambdaProperties);
});
