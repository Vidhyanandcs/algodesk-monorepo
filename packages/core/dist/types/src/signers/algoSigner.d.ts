import { Signer } from "./signer";
import { Transaction } from "algosdk";
export declare class BrowserAlgoSigner extends Signer {
    constructor();
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
}
