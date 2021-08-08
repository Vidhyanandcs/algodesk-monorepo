import { Algodv2, Transaction } from "algosdk";
import { Signer } from "../signers";
import SendRawTransaction from "algosdk/dist/types/src/client/v2/algod/sendRawTransaction";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
export declare class BaseClient {
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    sendTxn(unsignedTxn: Transaction): Promise<SendRawTransaction>;
    sendGroupTxns(unsignedTxns: Transaction[]): Promise<SendRawTransaction>;
}
