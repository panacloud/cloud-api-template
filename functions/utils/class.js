"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicClass = void 0;
const core_1 = require("@yellicode/core");
const typescript_1 = require("@yellicode/typescript");
const _ = require("lodash");
class BasicClass extends core_1.CodeWriter {
    initializeClass(name, contents, output) {
        const ts = new typescript_1.TypeScriptWriter(output);
        const classDefinition = {
            name: `${_.upperFirst(_.camelCase(name))}Stack`,
            extends: ["Stack"],
            export: true,
        };
        ts.writeClassBlock(classDefinition, () => {
            ts.writeLineIndented(` 
      constructor(scope: Construct, id: string, props?: StackProps) {
          super(scope, id, props);
      `);
            contents();
            ts.writeLineIndented(`}`);
        });
    }
}
exports.BasicClass = BasicClass;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbGFzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwQ0FBeUQ7QUFDekQsc0RBQTBFO0FBQzFFLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUU1QixNQUFhLFVBQVcsU0FBUSxpQkFBVTtJQUNqQyxlQUFlLENBQUMsSUFBWSxFQUFFLFFBQWEsRUFBRSxNQUFrQjtRQUNwRSxNQUFNLEVBQUUsR0FBRyxJQUFJLDZCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hDLE1BQU0sZUFBZSxHQUFvQjtZQUN2QyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTztZQUMvQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDbEIsTUFBTSxFQUFFLElBQUk7U0FDYixDQUFDO1FBQ0YsRUFBRSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1lBQ3ZDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQzs7O09BR3BCLENBQUMsQ0FBQztZQUNILFFBQVEsRUFBRSxDQUFDO1lBQ1gsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBakJELGdDQWlCQyJ9