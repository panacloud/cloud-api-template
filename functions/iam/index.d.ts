import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Iam extends CodeWriter {
    importIam(output: TextWriter): void;
    serviceRoleForAppsync(output: TextWriter, apiName: string): void;
    attachLambdaPolicyToRole(roleName: string): void;
}
