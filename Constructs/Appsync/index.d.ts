import { CodeWriter, TextWriter } from "@yellicode/core";
import { LAMBDA } from "../../cloud-api-constants";
export declare class Appsync extends CodeWriter {
    apiName: string;
    importAppsync(output: TextWriter): void;
    initializeAppsyncApi(name: string, output: TextWriter, authenticationType?: string): void;
    initializeAppsyncSchema(schema: string, output: TextWriter): void;
    initializeApiKeyForAppsync(apiName: string): void;
    appsyncLambdaDataSource(output: TextWriter, dataSourceName: string, serviceRole: string, lambdaStyle: LAMBDA, functionName?: string): void;
    appsyncLambdaResolver(fieldName: string, typeName: string, dataSourceName: string, output: TextWriter): void;
    appsyncApiTest(): void;
    appsyncApiKeyTest(): void;
    appsyncDatasourceTest(dataSourceName: string, lambdaFuncIndex: number): void;
    appsyncResolverTest(fieldName: string, typeName: string, dataSourceName: string): void;
}
