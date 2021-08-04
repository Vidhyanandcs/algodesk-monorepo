import { BaseSigner } from "./baseSigner";
import { Transaction } from "algosdk";
export declare class BrowserAlgoSigner extends BaseSigner {
    constructor();
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
}
