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
        if (AlgoSigner) {
            return true;
        }
        return false;
    }
}
exports.BrowserAlgoSigner = BrowserAlgoSigner;
//# sourceMappingURL=algoSigner.js.map