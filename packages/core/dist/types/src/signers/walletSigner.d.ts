import { Signer } from "./signer";
import { Account, Transaction } from "algosdk";
export declare class WalletSigner extends Signer {
    private wallet;
    constructor();
    setWallet(wallet: Account): void;
    getSecretKey(): Uint8Array;
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
}
