import { CodeWriter, TextWriter } from "@yellicode/core";
import { ClassDefinition, PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript";
import { CONSTRUCTS } from "../../cloud-api-constants";
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
  public importForAppsyncConstruct(output:TextWriter){
    const ts = new TypeScriptWriter(output);
    ts.writeImports( `../lib/${CONSTRUCTS.appsync}`, [CONSTRUCTS.appsync]);
  }

  
  public importForDynamodbConstruct(output:TextWriter){
    const ts = new TypeScriptWriter(output);
    ts.writeImports( `../lib/${CONSTRUCTS.dynamodb}`, [CONSTRUCTS.dynamodb]);
  }

  
  public importForLambdaConstruct(output:TextWriter){
    const ts = new TypeScriptWriter(output);
    ts.writeImports( `../lib/${CONSTRUCTS.lambda}`, [CONSTRUCTS.lambda]);
  }

  public importForNeptuneConstruct(output:TextWriter){
    const ts = new TypeScriptWriter(output);
    ts.writeImports( `../lib/${CONSTRUCTS.neptuneDb}`, [CONSTRUCTS.neptuneDb]);
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
        constructProps?.forEach(({name,type})=>{
          ts.writeLine(`${name}: ${type}`)
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
        ts.writeLineIndented(`${accessModifier}${isReadonly ?` readonly `:""} ${name} : ${typeName}`)
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

  public initializeTest(
    description: string,
    contents: any,
    output: TextWriter,
    workingDir:string
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeLineIndented(`test("${description}", () => {`);
    ts.writeLine(`const app = new cdk.App()`);
    ts.writeLine(`const stack = new ${workingDir}.${_.upperFirst(_.camelCase(workingDir))}Stack(app, "MyTestStack");`);
    ts.writeLine(`const actual = app.synth().getStackArtifact(stack.artifactId).template;`);
    ts.writeLine();
    contents();
    ts.writeLineIndented(`})`);
  }

  public initializeTest2(
    description: string,
    contents: any,
    output: TextWriter,
    constructor: string
  ) {
    const ts = new TypeScriptWriter(output);
    ts.writeLineIndented(`test("${description}", () => {`);
    ts.writeLine(`const stack = new cdk.Stack();`);
    ts.writeLine(`const ${constructor}-stack = new ${constructor}(stack, "${constructor}Test");`);
    ts.writeLine();
    contents();
    ts.writeLineIndented(`})`);
  }

  public ImportsForTest(output: TextWriter,workingDir:string) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", "cdk");
    ts.writeImports("@aws-cdk/assert", [
      "countResources",
      "haveResource",
      "expect",
      "countResourcesLike",
    ]);
    ts.writeImports(`../lib/${workingDir}-stack`, workingDir);
  }

  public ImportsForTest2(output: TextWriter, workingDir:string) {
    const ts = new TypeScriptWriter(output);
    ts.writeImports("aws-cdk-lib", "cdk");
    ts.writeLine(`import "@aws-cdk/assert/jest"`);
  }
}
