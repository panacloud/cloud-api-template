import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Iam extends CodeWriter {
    importIam(output: TextWriter): void;
    serviceRoleForLambda(apiName: string, output: TextWriter, managedPolicies?: string[]): void;
    serviceRoleForAppsync(output: TextWriter, apiName: string): void;
    attachLambdaPolicyToRole(roleName: string): void;
    appsyncServiceRoleTest(): void;
    appsyncRolePolicyTest(): void;
    lambdaServiceRoleTest(): void;
    lambdaServiceRolePolicyTestForDynodb(policyCount: number): void;
    roleIdentifierFromStack(): void;
    lambdaIdentifierFromStack(): void;
    roleIdentifierFromLambda(): void;
    DynodbIdentifierFromStack(): void;
}
