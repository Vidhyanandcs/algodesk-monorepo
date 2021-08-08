"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSigner = void 0;
const signer_1 = require("./signer");
class WalletSigner extends signer_1.Signer {
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
exports.WalletSigner = WalletSigner;
//# sourceMappingURL=walletSigner.js.map