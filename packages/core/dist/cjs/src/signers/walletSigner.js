"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSigner = void 0;
const constants_1 = require("../constants");
class WalletSigner {
    constructor(wallet) {
        if (wallet) {
            this.setWallet(wallet);
        }
        this.supportedNetworks = [constants_1.NETWORKS.BETANET, constants_1.NETWORKS.TESTNET, constants_1.NETWORKS.MAINNET];
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
    isInstalled() {
        return true;
    }
}
exports.WalletSigner = WalletSigner;
//# sourceMappingURL=walletSigner.js.map