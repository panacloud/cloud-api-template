"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFunction = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
class LambdaFunction extends core_1.CodeWriter {
    initializeLambdaFunction(output, lambdaStyle, content) {
        const ts = new typescript_1.TypeScriptWriter(output);
        if (lambdaStyle === "multiple lambda") {
            ts.writeLineIndented(`
      var AWS = require('aws-sdk');
      
      exports.handler = async() => {
        // write your code here
      }
      `);
        }
        else if (lambdaStyle === "single lambda") {
            ts.writeLine(`exports.handler = async (event:Event) => {`);
            ts.writeLine(`switch (event.info.fieldName) {`);
            ts.writeLine();
            content();
            ts.writeLine();
            ts.writeLine(`}`);
            ts.writeLine(`}`);
        }
    }
    importIndividualFunction(output, name, path) {
        const ts = new typescript_1.TypeScriptWriter(output);
        ts.writeImports(path, [name]);
    }
    helloWorldFunction(name) {
        this.writeLineIndented(`
    const AWS = require('aws-sdk');
    
    export const ${name} = async() => {
      // write your code here
    }
    `);
    }
}
exports.LambdaFunction = LambdaFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhRnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGFGdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQXlEO0FBRXpELE1BQWEsY0FBZSxTQUFRLGlCQUFVO0lBQ3JDLHdCQUF3QixDQUFDLE1BQWtCLEVBQUUsV0FBbUIsRUFBRSxPQUFhO1FBQ3BGLE1BQU0sRUFBRSxHQUFHLElBQUksNkJBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFeEMsSUFBRyxXQUFXLEtBQUssaUJBQWlCLEVBQUU7WUFDcEMsRUFBRSxDQUFDLGlCQUFpQixDQUFDOzs7Ozs7T0FNcEIsQ0FBQyxDQUFDO1NBQ0o7YUFDSSxJQUFHLFdBQVcsS0FBSyxlQUFlLEVBQUU7WUFDdkMsRUFBRSxDQUFDLFNBQVMsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1lBQzNELEVBQUUsQ0FBQyxTQUFTLENBQUMsaUNBQWlDLENBQUMsQ0FBQztZQUNoRCxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDZixPQUFPLEVBQUUsQ0FBQztZQUNWLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNmLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNuQjtJQUlILENBQUM7SUFDTSx3QkFBd0IsQ0FDN0IsTUFBa0IsRUFDbEIsSUFBWSxFQUNaLElBQVk7UUFFWixNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU0sa0JBQWtCLENBQUMsSUFBWTtRQUNwQyxJQUFJLENBQUMsaUJBQWlCLENBQUM7OzttQkFHUixJQUFJOzs7S0FHbEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBNUNELHdDQTRDQyJ9