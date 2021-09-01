import { Signer } from "../types";
import { Account, Transaction } from "algosdk";
export declare class WalletSigner implements Signer {
    private wallet;
    private supportedNetworks;
    constructor(wallet?: Account);
    setWallet(wallet: Account): void;
    signTxn(unsignedTxn: Transaction): Uint8Array;
    signGroupTxns(unsignedTxns: Transaction[]): Uint8Array[];
    isInstalled(): boolean;
    logout(): void;
}
