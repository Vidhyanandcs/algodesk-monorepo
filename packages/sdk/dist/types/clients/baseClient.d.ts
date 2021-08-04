import { BaseNet } from "../networks/baseNet";
import { Algodv2, Indexer, SuggestedParams, Transaction } from "algosdk";
import { BaseSigner } from "../signers";
import SendRawTransaction from "algosdk/dist/types/src/client/v2/algod/sendRawTransaction";
export declare class BaseClient {
    network: BaseNet;
    signer: BaseSigner;
    constructor(networkName: string, signerName: string);
    setNetwork(network: BaseNet): void;
    getNetwork(): BaseNet;
    getClient(): Algodv2;
    getIndexer(): Indexer;
    setSigner(signer: BaseSigner): void;
    getSigner(): BaseSigner;
    getNetworkParams(): Promise<SuggestedParams>;
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    sendTxn(unsignedTxn: Transaction): Promise<SendRawTransaction>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
    sendGroupTxns(unsignedTxns: Transaction[]): Promise<SendRawTransaction>;
}
