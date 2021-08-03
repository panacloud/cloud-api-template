import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Neptune extends CodeWriter {
    importNeptune(output: TextWriter): void;
    initializeNeptuneCluster(apiName: string, neptuneSubnetName: string, securityGroupName: string, output: TextWriter): void;
    initializeNeptuneSubnet(apiName: string, vpcName: string, output: TextWriter): void;
    initializeNeptuneInstance(apiName: string, vpcName: string, neptuneClusterName: string, output: TextWriter): void;
    addDependsOn(sourceName: string, depended: string): void;
}
