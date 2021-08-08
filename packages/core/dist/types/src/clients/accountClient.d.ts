import { BaseClient } from "./baseClient";
import { Algodv2 } from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { Signer } from "../signers";
export declare class AccountClient extends BaseClient {
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    getAccountInformation(address: any): Promise<any>;
    getCreatedAssets(address: string): Promise<any>;
    getApplicationTransactions(address: string, appId: number): Promise<any>;
}
