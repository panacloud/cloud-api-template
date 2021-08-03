import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class LambdaFunction extends CodeWriter {
    initializeLambdaFunction(output: TextWriter, lambdaStyle: string, content?: any): void;
    importIndividualFunction(output: TextWriter, name: string, path: string): void;
    helloWorldFunction(name: string): void;
}
