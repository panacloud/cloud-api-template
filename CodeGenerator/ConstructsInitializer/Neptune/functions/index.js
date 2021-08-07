"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.neptunePropertiesInitializer = void 0;
const typescript_1 = require("@yellicode/typescript");
const neptunePropertiesInitializer = (output, apiName) => {
    const ts = new typescript_1.TypeScriptWriter(output);
    ts.writeLine(`this.VPCRef = ${apiName}_vpc;`);
    ts.writeLine(`this.SGRef = ${apiName}_sg;`);
    ts.writeLine(`this.neptuneReaderEndpoint = ${apiName}_neptuneCluster.attrReadEndpoint`);
};
exports.neptunePropertiesInitializer = neptunePropertiesInitializer;
