import { BaseSigner } from "./baseSigner";
import { Transaction } from "algosdk";
export interface Wallet {
    sk: Uint8Array;
    address: string;
}
export declare class WalletSigner extends BaseSigner {
    wallet: Wallet;
    constructor();
    setWallet(wallet: Wallet): void;
    getSecretKey(): Uint8Array;
    signTxn(unsignedTxn: Transaction): Promise<Uint8Array>;
    signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]>;
}
