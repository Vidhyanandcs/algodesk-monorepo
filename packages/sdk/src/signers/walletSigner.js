import {BaseSigner} from "./baseSigner";

export class WalletSigner extends BaseSigner{
    constructor(wallet) {
        super();
        this.wallet = wallet;
    }

    getSecretKey() {
        const {sk} = this.wallet;
        return sk;
    }

    signTxn(unsignedTxn) {
        const sk = this.getSecretKey();
        const signedRawTxn = unsignedTxn.signTxn(sk);
        return signedRawTxn;
    }

    async signGroupTxns(unsignedTxns) {
        const signedTxns = [];

        unsignedTxns.forEach((unsignedTxn) => {
            signedTxns.push(this.signTxn(unsignedTxn));
        });

        return signedTxns;
    }
}