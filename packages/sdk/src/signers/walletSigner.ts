import {BaseSigner} from "./baseSigner";
import {Transaction} from "algosdk";

export interface Wallet {
    sk: Uint8Array,
    address: string
}

export class WalletSigner extends BaseSigner{
    wallet!: Wallet;

    constructor() {
        super();
    }

    setWallet(wallet: Wallet): void {
        this.wallet = wallet;
    }

    getSecretKey(): Uint8Array {
        const {sk} = this.wallet;
        return sk;
    }

    async signTxn(unsignedTxn: Transaction): Promise<Uint8Array> {
        const sk:Uint8Array = this.getSecretKey();
        const signedRawTxn: Uint8Array = unsignedTxn.signTxn(sk);
        return signedRawTxn;
    }

    async signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]> {
        const signedTxns: Uint8Array[] = [];

        unsignedTxns.forEach(async (unsignedTxn) => {
            const test: Uint8Array = await this.signTxn(unsignedTxn);
            signedTxns.push(test);
        });

        return signedTxns;
    }
}