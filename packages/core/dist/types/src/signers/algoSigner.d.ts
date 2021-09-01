import { Signer, SignerAccount } from "../types";
import { Transaction } from "algosdk";
export declare class BrowserAlgoSigner implements Signer {
    private supportedNetworks;
    constructor();
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
    isInstalled(): boolean;
    isNetworkSupported(name: string): boolean;
    getAlgoSignerNet(name: string): string;
    connect(name: string): Promise<SignerAccount[]>;
    logout(): void;
}
