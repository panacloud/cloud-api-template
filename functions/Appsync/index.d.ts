import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Appsync extends CodeWriter {
    apiName: string;
    ds: string;
    importAppsync(output: TextWriter): void;
    initializeAppsyncApi(name: string, output: TextWriter, authenticationType?: string): void;
    initializeAppsyncSchema(schema: string, output: TextWriter): void;
    initializeApiKeyForAppsync(apiName: string): void;
    appsyncDataSource(output: TextWriter, dataSourceName: string, serviceRole: string): void;
    lambdaDataSourceResolver(fieldName: string, typeName: string, dataSourceName?: string): void;
}
