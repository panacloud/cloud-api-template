import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Lambda extends CodeWriter {
    initializeLambda(name: string): void;
    importLambda(output: TextWriter): void;
    addEnvironment(name: string, value: string): void;
}
