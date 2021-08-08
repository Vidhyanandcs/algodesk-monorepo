import { Signer } from "./signer";
export class WalletSigner extends Signer {
    constructor() {
        super();
    }
    setWallet(wallet) {
        this.wallet = wallet;
    }
    getSecretKey() {
        const { sk } = this.wallet;
        return sk;
    }
    async signTxn(unsignedTxn) {
        const sk = this.getSecretKey();
        const signedRawTxn = unsignedTxn.signTxn(sk);
        return signedRawTxn;
    }
    async signGroupTxns(unsignedTxns) {
        const signedTxns = [];
        unsignedTxns.forEach(async (unsignedTxn) => {
            const test = await this.signTxn(unsignedTxn);
            signedTxns.push(test);
        });
        return signedTxns;
    }
}
//# sourceMappingURL=walletSigner.js.map