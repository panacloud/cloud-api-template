"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaHandlerForDynamodb = exports.lambdaProperiesHandlerForDynoDb = exports.lambdaProperiesHandlerForNeptuneDb = exports.lambdaProperiesHandlerForAuroraDb = exports.lambdaHandlerForNeptunedb = exports.lambdaHandlerForAuroradb = exports.lambdaPropsHandlerForAuroradb = exports.lambdaPropsHandlerForNeptunedb = void 0;
const typescript_1 = require("@yellicode/typescript");
const constant_1 = require("../../../../constant");
const Lambda_1 = require("../../../../Constructs/Lambda");
<<<<<<< HEAD
=======
const model = require("../../../../model.json");
const { apiName, lambdaStyle, database, apiType } = model.api;
let mutations = {};
let queries = {};
if (apiType === constant_1.APITYPE.graphql) {
    mutations = model.type.Mutation ? model.type.Mutation : {};
    queries = model.type.Query ? model.type.Query : {};
}
const mutationsAndQueries = Object.assign(Object.assign({}, mutations), queries);
>>>>>>> dev
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
const lambdaHandlerForAuroradb = (output, apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
<<<<<<< HEAD
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        if (dataBase === cloud_api_constants_1.DATABASE.auroraDb) {
=======
    if ((apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.single) ||
        apiType === constant_1.APITYPE.rest) {
        if (database === constant_1.DATABASE.aurora) {
>>>>>>> dev
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
<<<<<<< HEAD
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        if (dataBase === cloud_api_constants_1.DATABASE.auroraDb) {
=======
    else if (apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        if (database === constant_1.DATABASE.aurora) {
>>>>>>> dev
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
const lambdaHandlerForNeptunedb = (output, apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
<<<<<<< HEAD
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        if (dataBase === cloud_api_constants_1.DATABASE.neptuneDb) {
=======
    if ((apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.single) ||
        apiType === constant_1.APITYPE.rest) {
        if (database === constant_1.DATABASE.neptune) {
>>>>>>> dev
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
<<<<<<< HEAD
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        if (dataBase === cloud_api_constants_1.DATABASE.neptuneDb) {
=======
    else if (apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        if (database === constant_1.DATABASE.neptune) {
>>>>>>> dev
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
const lambdaProperiesHandlerForAuroraDb = (apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
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
<<<<<<< HEAD
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single && dataBase === cloud_api_constants_1.DATABASE.auroraDb) {
=======
    if (((lambdaStyle === constant_1.LAMBDASTYLE.single && apiType === constant_1.APITYPE.graphql) ||
        apiType === constant_1.APITYPE.rest) &&
        database === constant_1.DATABASE.aurora) {
>>>>>>> dev
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
<<<<<<< HEAD
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple && dataBase === cloud_api_constants_1.DATABASE.auroraDb) {
=======
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi &&
        apiType === constant_1.APITYPE.graphql &&
        database === constant_1.DATABASE.aurora) {
>>>>>>> dev
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
const lambdaProperiesHandlerForNeptuneDb = (apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
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
<<<<<<< HEAD
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single && dataBase === cloud_api_constants_1.DATABASE.neptuneDb) {
=======
    if (((lambdaStyle === constant_1.LAMBDASTYLE.single && apiType === constant_1.APITYPE.graphql) ||
        apiType === constant_1.APITYPE.rest) &&
        database === constant_1.DATABASE.neptune) {
>>>>>>> dev
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
<<<<<<< HEAD
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple && dataBase === cloud_api_constants_1.DATABASE.neptuneDb) {
=======
    else if (lambdaStyle === constant_1.LAMBDASTYLE.multi &&
        apiType === constant_1.APITYPE.graphql &&
        database === constant_1.DATABASE.aurora) {
>>>>>>> dev
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
const lambdaProperiesHandlerForDynoDb = (lambdaStyle, apiName, mutationsAndQueries) => {
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
const lambdaHandlerForDynamodb = (output, apiName, lambdaStyle, dataBase, mutationsAndQueries) => {
    const lambda = new Lambda_1.Lambda(output);
    const ts = new typescript_1.TypeScriptWriter(output);
<<<<<<< HEAD
    if (lambdaStyle === cloud_api_constants_1.LAMBDA.single) {
        if (dataBase === cloud_api_constants_1.DATABASE.dynamoDb) {
=======
    if ((apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.single) ||
        apiType === constant_1.APITYPE.rest) {
        if (database === constant_1.DATABASE.dynamo) {
>>>>>>> dev
            lambda.initializeLambda(apiName, output, lambdaStyle, undefined, undefined, undefined, [{ name: "TableName", value: "props!.tableName" }]);
            ts.writeLine();
            ts.writeLine(`this.${apiName}_lambdaFn = ${apiName}_lambdaFn`);
        }
    }
<<<<<<< HEAD
    else if (lambdaStyle === cloud_api_constants_1.LAMBDA.multiple) {
        if (dataBase === cloud_api_constants_1.DATABASE.dynamoDb) {
=======
    else if (apiType === constant_1.APITYPE.graphql && lambdaStyle === constant_1.LAMBDASTYLE.multi) {
        if (database === constant_1.DATABASE.dynamo) {
>>>>>>> dev
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
