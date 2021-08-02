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
            typeName: "any",
            initializer: () => {
                ts.writeLine(`new PanacloudManager(this, "${name}APIManager")`);
            },
        }, "const");
    }
}
exports.apiManager = apiManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsVUFBVyxTQUFRLGlCQUFVO0lBQ2pDLGdCQUFnQixDQUFDLE1BQWtCO1FBQ3hDLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsRUFBRSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU0scUJBQXFCLENBQUMsTUFBa0IsRUFBRSxJQUFZO1FBQzNELE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEMsRUFBRSxDQUFDLHdCQUF3QixDQUN6QjtZQUNFLElBQUksRUFBRSxZQUFZO1lBQ2xCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsV0FBVyxFQUFFLEdBQUcsRUFBRTtnQkFDaEIsRUFBRSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsSUFBSSxjQUFjLENBQUMsQ0FBQztZQUNsRSxDQUFDO1NBQ0YsRUFDRCxPQUFPLENBQ1IsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQW5CRCxnQ0FtQkMifQ==