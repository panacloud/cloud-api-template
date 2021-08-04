import { CodeWriter, TextWriter } from "@yellicode/core";
import { PropertyDefinition } from "@yellicode/typescript";
interface consturctProps {
    name: string;
    type: string;
}
export declare class Cdk extends CodeWriter {
    importsForStack(output: TextWriter): void;
    initializeStack(name: string, contents: any, output: TextWriter): void;
    initializeConstruct(constructName: string, propsName: string | undefined, contents: any, output: TextWriter, constructProps?: consturctProps[], properties?: PropertyDefinition[]): void;
    tagAdd(source: string, name: string, value: string): void;
}
export {};
