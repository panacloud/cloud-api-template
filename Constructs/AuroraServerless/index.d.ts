import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class AuroraServerless extends CodeWriter {
    importRds(output: TextWriter): void;
    initializeAuroraCluster(apiName: string, vpcName: string, output: TextWriter): void;
    connectionsAllowFromAnyIpv4(sourceName: string): void;
}
