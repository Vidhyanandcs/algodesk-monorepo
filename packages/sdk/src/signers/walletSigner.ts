import {Signer} from "./signer";
import {Account, Transaction} from "algosdk";

export class WalletSigner extends Signer{
    private wallet: Account;

    constructor() {
        super();
    }

    setWallet(wallet: Account): void {
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