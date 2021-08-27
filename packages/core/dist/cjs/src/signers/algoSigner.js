"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserAlgoSigner = void 0;
const constants_1 = require("../constants");
class BrowserAlgoSigner {
    constructor() {
        this.supportedNetworks = [constants_1.NETWORKS.BETANET, constants_1.NETWORKS.TESTNET, constants_1.NETWORKS.MAINNET];
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
        return typeof AlgoSigner !== 'undefined';
    }
    isNetworkSupported(name) {
        return this.supportedNetworks.indexOf(name) !== -1;
    }
    getAlgoSignerNet(name) {
        if (name == constants_1.NETWORKS.MAINNET) {
            return constants_1.ALGO_SIGNER_NET.MAINNET;
        }
        if (name == constants_1.NETWORKS.BETANET) {
            return constants_1.ALGO_SIGNER_NET.BETANET;
        }
        if (name == constants_1.NETWORKS.TESTNET) {
            return constants_1.ALGO_SIGNER_NET.TESTNET;
        }
    }
    async connect(name) {
        if (this.isInstalled()) {
            if (this.isNetworkSupported(name)) {
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
                throw new Error(name + " is not supported by AlgoSigner");
            }
        }
        else {
            throw new Error("Algosigner is not installed");
        }
    }
}
exports.BrowserAlgoSigner = BrowserAlgoSigner;
//# sourceMappingURL=algoSigner.js.map