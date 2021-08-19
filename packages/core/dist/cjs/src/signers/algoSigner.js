"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserAlgoSigner = void 0;
class BrowserAlgoSigner {
    constructor() {
    }
    async signTxn(unsignedTxn) {
        const byteTxn = unsignedTxn.toByte();
        // @ts-ignore
        const b64Txn = AlgoSigner.encoding.msgpackToBase64(byteTxn);
        // @ts-ignore
        const signedTxns = await AlgoSigner.signTxn([
            { txn: b64Txn },
        ]);
        // @ts-ignore
        const rawSignedTxn = AlgoSigner.encoding.base64ToMsgpack(signedTxns[0].blob);
        return rawSignedTxn;
    }
    async signGroupTxns(unsignedTxns) {
        const txns = [];
        unsignedTxns.forEach((unsignedTxn) => {
            const byteTxn = unsignedTxn.toByte();
            // @ts-ignore
            const b64Txn = AlgoSigner.encoding.msgpackToBase64(byteTxn);
            txns.push({
                txn: b64Txn
            });
        });
        // @ts-ignore
        const signedTxns = await AlgoSigner.signTxn(txns);
        const rawSignedTransactions = [];
        signedTxns.forEach((signedTxn) => {
            // @ts-ignore
            rawSignedTransactions.push(AlgoSigner.encoding.base64ToMsgpack(signedTxn.blob));
        });
        return rawSignedTransactions;
    }
    isInstalled() {
        // @ts-ignore
        if (typeof AlgoSigner !== 'undefined') {
            return true;
        }
        return false;
    }
    async connect() {
        if (this.isInstalled()) {
            const accounts = [];
            // @ts-ignore
            const connection = await AlgoSigner.connect();
            // @ts-ignore
            const wallets = await AlgoSigner.accounts({
                ledger: "MainNet"
            });
            if (wallets) {
                wallets.forEach((wallet) => {
                    accounts.push({
                        address: wallet.address,
                        name: wallet.name
                    });
                });
            }
            return accounts;
        }
        else {
            throw {
                message: "Algosigner is not installed"
            };
        }
    }
}
exports.BrowserAlgoSigner = BrowserAlgoSigner;
//# sourceMappingURL=algoSigner.js.map