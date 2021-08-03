import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Iam extends CodeWriter {
    importIam(output: TextWriter): void;
    serviceRoleForLambda(apiName: string, output: TextWriter, managedPolicies?: string[]): void;
    serviceRoleForAppsync(output: TextWriter, apiName: string): void;
    attachLambdaPolicyToRole(roleName: string): void;
}
