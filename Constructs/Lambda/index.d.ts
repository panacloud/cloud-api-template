import { CodeWriter, TextWriter } from "@yellicode/core";
interface Environment {
    name: string;
    value: string;
}
export declare class Lambda extends CodeWriter {
    importLambda(output: TextWriter): void;
    initializeLambda(apiName: string, output: TextWriter, lambdaStyle: string, functionName?: string, vpcName?: string, securityGroupsName?: string, environments?: Environment[], vpcSubnets?: string, roleName?: string): void;
    nodeAddDependency(sourceName: string, valueName: string): void;
    addEnvironment(lambda: string, envName: string, value: string, lambdaStyle: string, functionName?: string): void;
}
export {};