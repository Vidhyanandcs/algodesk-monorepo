import {Transaction} from "algosdk";

export interface Signer {
    signTxn?(unsignedTxn: Transaction): Uint8Array | Promise<Uint8Array>;
    signGroupTxns?(unsignedTxns: Transaction[]): Uint8Array[] | Promise<Uint8Array[]>;
    signTxnByLogic?(unsignedTxn, logic: string): Promise<Uint8Array>;
}

export type T_SendTxnResponse = {
    txId: string
}

export interface T_PendingTransactionResponse {
    'confirmed-round': number
    "asset-index": number
    'application-index': number
}