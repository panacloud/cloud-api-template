"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiManager = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class apiManager extends core_1.CodeWriter {
    importApiManager(output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports("panacloud-manager", ["PanacloudManager"]);
    }
    apiManagerInitializer(output, name) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeVariableDeclaration({
            name: "apiManager",
            typeName: "PanacloudManager",
            initializer: () => {
                ts.writeLine(`new PanacloudManager(this, "${name}APIManager")`);
            },
        }, "const");
    }
}
exports.apiManager = apiManager;
