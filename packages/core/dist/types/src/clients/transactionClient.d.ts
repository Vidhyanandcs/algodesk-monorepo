import { Algodv2, SuggestedParams, Transaction } from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { Signer, A_PendingTransactionResponse, A_SendTxnResponse } from "../types";
export declare class TransactionClient {
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    getSuggestedParams(): Promise<SuggestedParams>;
    waitForConfirmation(txId: string): Promise<A_PendingTransactionResponse>;
    pendingTransactionInformation(txId: string): Promise<A_PendingTransactionResponse>;
    get(txId: string): Promise<any>;
    sendTxn(unsignedTxn: Transaction): Promise<A_SendTxnResponse>;
    sendGroupTxns(unsignedTxns: Transaction[]): Promise<any>;
}
