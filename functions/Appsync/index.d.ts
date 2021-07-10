import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Appsync extends CodeWriter {
    initializeAppsync(name: string): void;
    importAppsync(output: TextWriter): void;
    lambdaDataSource(name: string, lambda: string): void;
    lambdaDataSourceResolverQuery(value: string): void;
    lambdaDataSourceResolverMutation(value: string): void;
}
