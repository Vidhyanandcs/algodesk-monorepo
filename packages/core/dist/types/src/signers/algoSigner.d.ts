import { Signer, SignerAccount } from "../types";
import { Transaction } from "algosdk";
export declare class BrowserAlgoSigner implements Signer {
    constructor();
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
    isInstalled(): boolean;
    connect(): Promise<SignerAccount[]>;
}
