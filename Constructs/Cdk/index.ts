import { CodeWriter, TextWriter } from "@yellicode/core";
import { ClassDefinition, PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
const _ = require("lodash");

interface consturctProps {
  name :string,
  type:string
}
export class Cdk extends CodeWriter {

  public importsForStack(output: TextWriter){
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", ["Stack", "StackProps"]);
    ts.writeImports("constructs", ["Construct"]);
  }

  public initializeStack(name: string, contents: any, output: TextWriter) {
    const ts = new TypeScriptWriter(output);
    const classDefinition: ClassDefinition = {
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

  public initializeConstruct(constructName: string, propsName:string ="StackProps", contents: any, output: TextWriter ,constructProps?:consturctProps[],properties?:PropertyDefinition[]) {
    const ts = new TypeScriptWriter(output);
    ts.writeLine()
    if(constructProps){
      ts.writeInterfaceBlock({
        name:propsName
      },()=>{
        constructProps?.forEach((prop)=>{
          ts.writeLine(`${prop.name}: ${prop.type}`)
        })
    })
    ts.writeLine()    
    }
    const classDefinition: ClassDefinition = {
      name: `${_.upperFirst(_.camelCase(constructName))}`,
      extends: ["Construct"],
      export: true,
    };

    ts.writeClassBlock(classDefinition, () => {
      properties?.forEach(({accessModifier,isReadonly,name,typeName})=>{
        ts.writeLineIndented(`${accessModifier}${isReadonly ?` readonly`:""}${name} : ${typeName}`)
      })
      ts.writeLineIndented(` 
      constructor(scope: Construct, id: string, props?: ${propsName}) {
          super(scope, id);
      `);
      contents();
      ts.writeLineIndented(`}`);
    })
  }

  public nodeAddDependency(sourceName: string, valueName: string) {
    this.writeLine(`${sourceName}.node.addDependency(${valueName});`);
  }
  
  public tagAdd(source: string, name: string, value: string) {
    this.writeLine(`Tags.of(${source}).add("${name}", "${value}");`);
  }
}
