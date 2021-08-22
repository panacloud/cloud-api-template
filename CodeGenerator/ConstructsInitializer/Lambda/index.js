"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templating_1 = require("@yellicode/templating");
const constant_1 = require("../../../constant");
const Cdk_1 = require("../../../Constructs/Cdk");
const Ec2_1 = require("../../../Constructs/Ec2");
const Iam_1 = require("../../../Constructs/Iam");
const Lambda_1 = require("../../../Constructs/Lambda");
const functions_1 = require("./functions");
const model = require("../../../model.json");
const { lambdaStyle, database } = model.api;
templating_1.Generator.generate({
    outputFile: `${constant_1.PATH.construct}${constant_1.CONSTRUCTS.lambda}/index.ts`,
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
    if (database === constant_1.DATABASE.dynamo) {
        lambdaProps = [
            {
                name: "tableName",
                type: "string",
            },
        ];
        lambdaPropsWithName = "handlerProps";
        lambdaProperties = functions_1.lambdaProperiesHandlerForDynoDb(output);
    }
    if (database === constant_1.DATABASE.neptune) {
        lambdaPropsWithName = "handlerProps";
        lambdaProps = functions_1.lambdaPropsHandlerForNeptunedb();
        lambdaProperties = functions_1.lambdaProperiesHandlerForNeptuneDb(output);
    }
    if (database === constant_1.DATABASE.aurora) {
        lambdaPropsWithName = "handlerProps";
        lambdaProps = functions_1.lambdaPropsHandlerForAuroradb();
        lambdaProperties = functions_1.lambdaProperiesHandlerForAuroraDb(output);
    }
    cdk.initializeConstruct(constant_1.CONSTRUCTS.lambda, lambdaPropsWithName, () => {
        if (database === constant_1.DATABASE.dynamo) {
            functions_1.lambdaHandlerForDynamodb(output);
        }
        if (database === constant_1.DATABASE.neptune) {
            functions_1.lambdaHandlerForNeptunedb(output, lambdaStyle, database);
        }
        if (database === constant_1.DATABASE.aurora) {
            functions_1.lambdaHandlerForAuroradb(output, lambdaStyle, database);
        }
    }, output, lambdaProps, lambdaProperties);
});
