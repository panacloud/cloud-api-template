"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecretsManager = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class SecretsManager extends core_1.CodeWriter {
    importSecretsManager(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("aws-cdk-lib", ["aws_secretsmanager as sm"]);
    }
    fromSecretAttributes(secretName) {
        this.writeLine(`sm.Secret.fromSecretAttributes(this, "${secretName}", { secretArn: ${secretName} }).secretValue`);
    }
}
exports.SecretsManager = SecretsManager;
