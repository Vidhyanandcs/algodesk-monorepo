import { Signer, SignerAccount } from "../types";
import { Transaction } from "algosdk";
export declare class WalletConnectSigner implements Signer {
    bridge: string;
    connection: any;
    private supportedNetworks;
    constructor();
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
    connect(name: string): Promise<SignerAccount[]>;
    isInstalled(): boolean;
    isNetworkSupported(name: string): boolean;
}
