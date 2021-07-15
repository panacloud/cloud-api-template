import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class LambdaFunction extends CodeWriter {
    initializeLambdaFunction(content: any, output: TextWriter): void;
    importIndividualFunction(output: TextWriter, name: string, path: string): void;
    helloWorldFunction(name: string): void;
}
