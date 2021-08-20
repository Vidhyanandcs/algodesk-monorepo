import { ALGO_SIGNER_NET, NETWORKS } from "../constants";
export class BrowserAlgoSigner {
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
    getAlgoSignerNet(name) {
        if (name == NETWORKS.MAINNET) {
            return ALGO_SIGNER_NET.MAINNET;
        }
        if (name == NETWORKS.BETANET) {
            return ALGO_SIGNER_NET.BETANET;
        }
        if (name == NETWORKS.TESTNET) {
            return ALGO_SIGNER_NET.TESTNET;
        }
    }
    async connect(name) {
        if (this.isInstalled()) {
            const accounts = [];
            // @ts-ignore
            const connection = await AlgoSigner.connect();
            // @ts-ignore
            const wallets = await AlgoSigner.accounts({
                ledger: this.getAlgoSignerNet(name)
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
//# sourceMappingURL=algoSigner.js.map