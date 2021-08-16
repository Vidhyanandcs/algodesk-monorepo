export class WalletSigner {
    constructor(wallet) {
        if (wallet) {
            this.setWallet(wallet);
        }
    }
    setWallet(wallet) {
        this.wallet = wallet;
    }
    signTxn(unsignedTxn) {
        const { sk } = this.wallet;
        const signedRawTxn = unsignedTxn.signTxn(sk);
        return signedRawTxn;
    }
    signGroupTxns(unsignedTxns) {
        const signedTxns = [];
        unsignedTxns.forEach((unsignedTxn) => {
            const test = this.signTxn(unsignedTxn);
            signedTxns.push(test);
        });
        return signedTxns;
    }
}
//# sourceMappingURL=walletSigner.js.map