"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandlerForDynamodb = exports.lambdaProperiesHandlerForDynoDb = exports.lambdaProperiesHandlerForNeptuneDb = exports.lambdaProperiesHandlerForAuroraDb = exports.lambdaHandlerForNeptunedb = exports.lambdaHandlerForAuroradb = exports.lambdaPropsHandlerForAuroradb = exports.lambdaPropsHandlerForNeptunedb = void 0;
const typescript_1 = require("@yellicode/typescript");
const cloud_api_constants_1 = require("../../../../cloud-api-constants");
const Lambda_1 = require("../../../../Constructs/Lambda");
const lambdaPropsHandlerForNeptunedb = () => {
    let props;
    return props = [{
            name: "VPCRef",
            type: "ec2.Vpc"
        }, {
            name: "SGRef",
            type: "ec2.SecurityGroup"
        }, {
            name: "neptuneReaderEndpoint",
            type: "string"
        }];
};
exports.lambdaPropsHandlerForNeptunedb = lambdaPropsHandlerForNeptunedb;
const lambdaPropsHandlerForAuroradb = () => {
    let props;
    return props = [{
            name: "vpcRef",
            type: "ec2.Vpc"
        }, {
            name: "secretRef",
            type: "string"
        }, {
            name: "serviceRole",
            type: "iam.Role"
        }];
};
exports.lambdaPropsHandlerForAuroradb = lambdaPropsHandlerForAuroradb;
const lambdaHandlerForAuroradb = (output, apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        if (dataBase === cloud_api_constants_1.DATABASE.auroraDb) {
            lambda.initializeLambda(apiName, output, lambdaStyle, undefined, `props!.vpcRef`, undefined, [
                {
                    name: "INSTANCE_CREDENTIALS",
                    value: `props!.secretRef`,
                },
            ], undefined, `props!.serviceRole`);
            ts.writeLine();
            ts.writeLine(`this.${apiName}_lambdaFnArn = ${apiName}_lambdaFn.functionArn`);
            ts.writeLine();
        }
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        if (dataBase === cloud_api_constants_1.DATABASE.auroraDb) {
            Object.keys(mutationsAndQueries).forEach((key) => {
                lambda.initializeLambda(apiName, output, lambdaStyle, key, `props!.vpcRef`, undefined, [
                    {
                        name: "INSTANCE_CREDENTIALS",
                        value: `props!.secretRef`,
                    },
                ], undefined, `props!.serviceRole`);
                ts.writeLine();
                ts.writeLine(`this.${apiName}_lambdaFn_${key}Arn = ${apiName}_lambdaFn_${key}.functionArn`);
                ts.writeLine();
            });
        }
        else {
            ts.writeLine();
        }
    }
    ;
};
exports.lambdaHandlerForAuroradb = lambdaHandlerForAuroradb;
const lambdaHandlerForNeptunedb = (output, apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    console.log("line number 91 lambdaHandlerForNeptunedb===>", lambdaStyle);
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        if (dataBase === cloud_api_constants_1.DATABASE.neptuneDb) {
            lambda.initializeLambda(apiName, output, lambdaStyle, undefined, `props!.VPCRef`, `props!.SGRef`, [
                {
                    name: "NEPTUNE_ENDPOINT",
                    value: `props!.neptuneReaderEndpoint`,
                },
            ], `ec2.SubnetType.ISOLATED`);
            ts.writeLine();
            ts.writeLine(`this.${apiName}_lambdaFnArn = ${apiName}_lambdaFn.functionArn`);
            ts.writeLine();
        }
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        console.log("line number 91 under condition lambdaHandlerForNeptunedb===>", lambdaStyle);
        if (dataBase === cloud_api_constants_1.DATABASE.neptuneDb) {
            Object.keys(mutationsAndQueries).forEach((key) => {
                lambda.initializeLambda(apiName, output, lambdaStyle, key, `props!.VPCRef`, `props!.SGRef`, [
                    {
                        name: "NEPTUNE_ENDPOINT",
                        value: `props!.neptuneReaderEndpoint`,
                    },
                ], `ec2.SubnetType.ISOLATED`);
                ts.writeLine();
                ts.writeLine(`this.${apiName}_lambdaFn_${key}Arn = ${apiName}_lambdaFn_${key}.functionArn`);
                ts.writeLine();
            });
        }
        else {
            ts.writeLine();
        }
    }
    ;
};
exports.lambdaHandlerForNeptunedb = lambdaHandlerForNeptunedb;
const lambdaProperiesHandlerForAuroraDb = (apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
    let properties = [
        {
            name: `${apiName}_lambdaFnArn`,
            typeName: "string",
            accessModifier: "public",
        },
    ];
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single && dataBase === cloud_api_constants_1.DATABASE.auroraDb) {
        properties = [
            {
                name: `${apiName}_lambdaFnArn`,
                typeName: "string",
                accessModifier: "public",
                isReadonly: true
            },
        ];
        return properties;
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple && dataBase === cloud_api_constants_1.DATABASE.auroraDb) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            properties[index] = {
                name: `${apiName}_lambdaFn_${key}Arn`,
                typeName: "string",
                accessModifier: "public",
                isReadonly: true
            };
        });
        return properties;
    }
};
exports.lambdaProperiesHandlerForAuroraDb = lambdaProperiesHandlerForAuroraDb;
const lambdaProperiesHandlerForNeptuneDb = (apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
    let properties = [
        {
            name: `${apiName}_lambdaFnArn`,
            typeName: "string",
            accessModifier: "public",
        },
    ];
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single && dataBase === cloud_api_constants_1.DATABASE.neptuneDb) {
        properties = [
            {
                name: `${apiName}_lambdaFnArn`,
                typeName: "string",
                accessModifier: "public",
                isReadonly: true
            },
        ];
        return properties;
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple && dataBase === cloud_api_constants_1.DATABASE.neptuneDb) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            properties[index] = {
                name: `${apiName}_lambdaFn_${key}Arn`,
                typeName: "string",
                accessModifier: "public",
                isReadonly: true
            };
        });
        return properties;
    }
};
exports.lambdaProperiesHandlerForNeptuneDb = lambdaProperiesHandlerForNeptuneDb;
const lambdaProperiesHandlerForDynoDb = (lambdaStyle, apiName, mutationsAndQueries) => {
    let properties = [
        {
            name: `${apiName}_lambdaFn`,
            typeName: "lambda.Function",
            accessModifier: "public",
        },
    ];
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        return properties;
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            properties[index] = {
                name: `${apiName}_lambdaFn_${key}`,
                typeName: "lambda.Function",
                accessModifier: "public",
            };
        });
        return properties;
    }
};
exports.lambdaProperiesHandlerForDynoDb = lambdaProperiesHandlerForDynoDb;
const lambdaHandlerForDynamodb = (output, apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        if (dataBase === cloud_api_constants_1.DATABASE.dynamoDb) {
            lambda.initializeLambda(apiName, output, lambdaStyle, undefined, undefined, undefined, [{ name: "TableName", value: "props!.tableName" }]);
            ts.writeLine();
            ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
        }
    }
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        if (dataBase === cloud_api_constants_1.DATABASE.dynamoDb) {
            Object.keys(mutationsAndQueries).forEach((key) => {
                lambda.initializeLambda(apiName, output, lambdaStyle, key, undefined, undefined, [{ name: "TableName", value: "props!.tableName" }]);
                ts.writeLine();
                ts.writeLine(`this.${apiName}_lambdaFn_${key} = ${apiName}_lambdaFn_${key}`);
                ts.writeLine();
            });
        }
    }
    else {
        ts.writeLine();
    }
};
exports.lambdaHandlerForDynamodb = lambdaHandlerForDynamodb;
