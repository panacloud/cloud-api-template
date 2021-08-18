"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auroradbPropertiesHandler = exports.auroradbPropertiesInitializer = void 0;
const typescript_1 = require("@yellicode/typescript");
const auroradbPropertiesInitializer = (output, apiName) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`this.serviceRole = ${apiName}Lambda_serviceRole;`);
    ts.writeLine(`this.vpcRef = ${apiName}_vpc;`);
    ts.writeLine(`this.secretRef = ${apiName}_secret`);
};
exports.auroradbPropertiesInitializer = auroradbPropertiesInitializer;
const auroradbPropertiesHandler = () => {
    return [{
            name: "secretRef",
            typeName: "string",
            accessModifier: "public",
            isReadonly: true
        }, {
            name: "vpcRef",
            typeName: "ec2.Vpc",
            accessModifier: "public",
            isReadonly: true
        }, {
            name: "serviceRole",
            typeName: "iam.Role",
            accessModifier: "public",
            isReadonly: true
        }];
};
exports.auroradbPropertiesHandler = auroradbPropertiesHandler;
