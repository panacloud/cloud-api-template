import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class DynamoDB extends CodeWriter {
    initializeDynamodb(apiName: string, output: TextWriter): void;
    importDynamodb(output: TextWriter): void;
    grantFullAccess(lambda: string): void;
}
