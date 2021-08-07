import { TextWriter } from "@yellicode/core"
import { PropertyDefinition, TypeScriptWriter } from "@yellicode/typescript"

export const auroradbPropertiesInitializer=(output:TextWriter,apiName:string)=>{ 
    const ts = new TypeScriptWriter(output)
    ts.writeLine(`this.serviceRole = ${apiName}Lambda_serviceRole;`)
    ts.writeLine(`this.vpcRef = ${apiName}_vpc;`)
    ts.writeLine(`this.secretRef = ${apiName}_secret`)
}

export const auroradbPropertiesHandler=():PropertyDefinition[]=>{
    return [{
        name:"secretRef",
        typeName:"string",
        accessModifier:"public",
        isReadonly:true
    },{
        name:"vpcRef",
        typeName:"ec2.Vpc",
        accessModifier:"public",
        isReadonly:true
    },{
        name:"serviceRole",
        typeName:"iam.Role",
        accessModifier:"public",
        isReadonly:true
    }]
}