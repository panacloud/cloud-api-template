import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class DynamoDB extends CodeWriter {
    importDynamodb(output: TextWriter): void;
    initializeDynamodb(apiName: string, output: TextWriter): void;
    grantFullAccess(lambda: string, tableName: string, lambdaStyle: string, functionName?: string): void;
    dbConstructLambdaAccess(apiName: string, dbConstructName: string, lambdaConstructName: string, lambdaStyle: string, functionName?: string): void;
    initializeTestForDynamodb(TableName: string): void;
}
