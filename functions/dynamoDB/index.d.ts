import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class DynamoDB extends CodeWriter {
    initializeDynamodb(name: string): void;
    importDynamodb(output: TextWriter): void;
    grantFullAccess(lambda: string): void;
}
