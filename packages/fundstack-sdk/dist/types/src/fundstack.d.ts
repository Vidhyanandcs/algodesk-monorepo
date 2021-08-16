import { Network, Signer } from "@algodesk/core";
import sdk from "algosdk";
export declare class Fundstack {
    private algodesk;
    constructor(network: Network, signer: Signer);
    compileEscrow(fund: any): Promise<any>;
    get(fundId: number): Promise<any>;
    getEscrow(address: string): Promise<import("@algodesk/core").A_AccountInformation>;
    getAsset(assetId: number): Promise<sdk.modelsv2.Asset>;
    getCompany(companyDetailsTxId: string): Promise<any>;
    getStatus(globalState: any): Promise<{
        registration: {
            start: any;
            end: any;
            pending: boolean;
            active: boolean;
            completed: boolean;
        };
        sale: {
            start: any;
            end: any;
            pending: boolean;
            active: boolean;
            completed: boolean;
        };
        phase: number;
        claim: {
            start: any;
            end: any;
            pending: boolean;
            active: boolean;
            completed: boolean;
        };
        date: number;
    }>;
}
