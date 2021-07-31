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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsY0FBZSxTQUFRLGlCQUFVO0lBQ3JDLG9CQUFvQixDQUFDLE1BQWtCO1FBQzVDLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsRUFBRSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVNLG9CQUFvQixDQUFDLFVBQWtCO1FBQzVDLElBQUksQ0FBQyxTQUFTLENBQ1oseUNBQXlDLFVBQVUsbUJBQW1CLFVBQVUsaUJBQWlCLENBQ2xHLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFYRCx3Q0FXQyJ9