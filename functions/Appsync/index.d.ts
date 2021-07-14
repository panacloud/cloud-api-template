import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Appsync extends CodeWriter {
    private apiName;
    private ds;
    importAppsync(output: TextWriter): void;
    initializeAppsyncApi(name: string, output: TextWriter): void;
    appsyncDataSource(output: TextWriter, dataSourceName: string): void;
    lambdaDataSourceResolver(fieldName: string, typeName: string, dataSourceName: string): void;
}
