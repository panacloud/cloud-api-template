"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandlerForDynamodb = exports.lambdaProperiesHandlerForDynoDb = exports.lambdaProperiesHandlerForNeptuneDb = exports.lambdaProperiesHandlerForAuroraDb = exports.lambdaHandlerForNeptunedb = exports.lambdaHandlerForAuroradb = exports.lambdaPropsHandlerForAuroradb = exports.lambdaPropsHandlerForNeptunedb = void 0;
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../../../constant");
const Lambda_1 = require("../../../../Constructs/Lambda");
const lambdaPropsHandlerForNeptunedb = () => {
    let props;
    return (props = [
        {
            name: "VPCRef",
            type: "ec2.Vpc",
        },
        {
            name: "SGRef",
            type: "ec2.SecurityGroup",
        },
        {
            name: "neptuneReaderEndpoint",
            type: "string",
        },
    ]);
};
exports.lambdaPropsHandlerForNeptunedb = lambdaPropsHandlerForNeptunedb;
const lambdaPropsHandlerForAuroradb = () => {
    let props;
    return (props = [
        {
            name: "vpcRef",
            type: "ec2.Vpc",
        },
        {
            name: "secretRef",
            type: "string",
        },
        {
            name: "serviceRole",
            type: "iam.Role",
        },
    ]);
};
exports.lambdaPropsHandlerForAuroradb = lambdaPropsHandlerForAuroradb;
const lambdaHandlerForAuroradb = (output, lambdaStyle, database, apiType, apiName, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if ((apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.single) ||
        apiType === constant_1.APITYPE.rest) {
        if (database === constant_1.DATABASE.aurora) {
            lambda.initializeLambda(apiName, output, lambdaStyle, undefined, `props!.vpcRef`, undefined, [
                {
                    name: "INSTANCE_CREDENTIALS",
                    value: `props!.secretRef`,
                },
            ], undefined, `props!.serviceRole`);
            ts.writeLine();
            ts.writeLine(`this.${apiName}_lambdaFnArn = ${apiName}_lambdaFn.functionArn`);
            if (apiType === constant_1.APITYPE.rest)
                ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
            ts.writeLine();
        }
    }
    else if (apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        if (database === constant_1.DATABASE.aurora) {
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
};
exports.lambdaHandlerForAuroradb = lambdaHandlerForAuroradb;
const lambdaHandlerForNeptunedb = (output, lambdaStyle, database, apiType, apiName, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if ((apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.single) ||
        apiType === constant_1.APITYPE.rest) {
        if (database === constant_1.DATABASE.neptune) {
            lambda.initializeLambda(apiName, output, lambdaStyle, undefined, `props!.VPCRef`, `props!.SGRef`, [
                {
                    name: "NEPTUNE_ENDPOINT",
                    value: `props!.neptuneReaderEndpoint`,
                },
            ], `ec2.SubnetType.ISOLATED`);
            ts.writeLine();
            ts.writeLine(`this.${apiName}_lambdaFnArn = ${apiName}_lambdaFn.functionArn`);
            if (apiType === constant_1.APITYPE.rest)
                ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
            ts.writeLine();
        }
    }
    else if (apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        if (database === constant_1.DATABASE.neptune) {
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
};
exports.lambdaHandlerForNeptunedb = lambdaHandlerForNeptunedb;
const lambdaProperiesHandlerForAuroraDb = (apiName, apiType, lambdaStyle, database, mutationsAndQueries) => {
    let properties = [
        {
            name: `${apiName}_lambdaFnArn`,
            typeName: "string",
            accessModifier: "public",
        },
        {
            name: `${apiName}_lambdaFn`,
            typeName: "lambda.Function",
            accessModifier: "public",
        },
    ];
    if (((lambdaStyle === constant_1.LAMBDASTYLE.single && apiType === constant_1.APITYPE.graphql) ||
        apiType === constant_1.APITYPE.rest) &&
        database === constant_1.DATABASE.aurora) {
        properties = [
            {
                name: `${apiName}_lambdaFnArn`,
                typeName: "string",
                accessModifier: "public",
                isReadonly: true,
            },
            {
                name: `${apiName}_lambdaFn`,
                typeName: "lambda.Function",
                accessModifier: "public",
            },
        ];
        return properties;
    }
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi &&
        apiType === constant_1.APITYPE.graphql &&
        database === constant_1.DATABASE.aurora) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            properties[index] = {
                name: `${apiName}_lambdaFn_${key}Arn`,
                typeName: "string",
                accessModifier: "public",
                isReadonly: true,
            };
        });
        return properties;
    }
};
exports.lambdaProperiesHandlerForAuroraDb = lambdaProperiesHandlerForAuroraDb;
const lambdaProperiesHandlerForNeptuneDb = (apiName, apiType, lambdaStyle, database, mutationsAndQueries) => {
    let properties = [
        {
            name: `${apiName}_lambdaFnArn`,
            typeName: "string",
            accessModifier: "public",
        },
        {
            name: `${apiName}_lambdaFn`,
            typeName: "lambda.Function",
            accessModifier: "public",
        },
    ];
    if (((lambdaStyle === constant_1.LAMBDASTYLE.single && apiType === constant_1.APITYPE.graphql) ||
        apiType === constant_1.APITYPE.rest) &&
        database === constant_1.DATABASE.neptune) {
        properties = [
            {
                name: `${apiName}_lambdaFnArn`,
                typeName: "string",
                accessModifier: "public",
                isReadonly: true,
            },
            {
                name: `${apiName}_lambdaFn`,
                typeName: "lambda.Function",
                accessModifier: "public",
            },
        ];
        return properties;
    }
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi &&
        apiType === constant_1.APITYPE.graphql &&
        database === constant_1.DATABASE.neptune) {
        Object.keys(mutationsAndQueries).forEach((key, index) => {
            properties[index] = {
                name: `${apiName}_lambdaFn_${key}Arn`,
                typeName: "string",
                accessModifier: "public",
                isReadonly: true,
            };
        });
        return properties;
    }
};
exports.lambdaProperiesHandlerForNeptuneDb = lambdaProperiesHandlerForNeptuneDb;
const lambdaProperiesHandlerForDynoDb = (lambdaStyle, apiName, apiType, mutationsAndQueries) => {
    let properties = [
        {
            name: `${apiName}_lambdaFn`,
            typeName: "lambda.Function",
            accessModifier: "public",
        },
    ];
    if ((apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.single) ||
        apiType === constant_1.APITYPE.rest) {
        properties = [
            {
                name: `${apiName}_lambdaFn`,
                typeName: "lambda.Function",
                accessModifier: "public",
            },
        ];
        return properties;
    }
    else if (apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
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
const lambdaHandlerForDynamodb = (output, apiName, apiType, lambdaStyle, database, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
    if ((apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.single) ||
        apiType === constant_1.APITYPE.rest) {
        if (database === constant_1.DATABASE.dynamo) {
            lambda.initializeLambda(apiName, output, lambdaStyle, undefined, undefined, undefined, [{ name: "TableName", value: "props!.tableName" }]);
            ts.writeLine();
            ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
        }
    }
    else if (apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        if (database === constant_1.DATABASE.dynamo) {
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
