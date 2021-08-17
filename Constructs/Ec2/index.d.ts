import { CodeWriter, TextWriter } from "@yellicode/core";
export declare class Ec2 extends CodeWriter {
    importEc2(output: TextWriter): void;
    initializeVpc(apiName: string, output: TextWriter, subnetConfig?: string): void;
    initializeSecurityGroup(apiName: string, vpcName: string, output: TextWriter): void;
    securityGroupAddIngressRule(apiName: string, securityGroupName: string): void;
}
