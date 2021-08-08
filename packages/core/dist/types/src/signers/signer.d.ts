import { Transaction } from "algosdk";
export declare class Signer {
    constructor();
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
    setWallet(wallet: any): void;
}
