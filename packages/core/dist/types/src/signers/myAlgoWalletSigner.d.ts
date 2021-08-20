import { Signer, SignerAccount } from "../types";
import { Transaction } from "algosdk";
export declare class MyAlgoWalletSigner implements Signer {
    private readonly myAlgoConnect;
    constructor();
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
    connect(name: string): Promise<SignerAccount[]>;
    isInstalled(): boolean;
}
