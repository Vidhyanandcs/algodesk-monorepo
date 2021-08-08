import { BaseClient } from "./baseClient";
import { Algodv2, SuggestedParams } from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { Signer } from "../signers";
export declare class TransactionClient extends BaseClient {
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    getSuggestedParams(): Promise<SuggestedParams>;
    waitForConfirmation(txId: string): Promise<void>;
    pendingTransactionInformation(txId: string): Promise<any>;
    get(txId: string): Promise<any>;
}
