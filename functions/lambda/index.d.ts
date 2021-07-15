import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Lambda extends CodeWriter {
    importLambda(output: TextWriter): void;
    initializeLambda(apiName: string, output: TextWriter): void;
    addEnvironment(lambda: string, envName: string, value: string): void;
}
