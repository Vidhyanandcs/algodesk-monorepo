import { ALGO_SIGNER_NET, NETWORKS } from "../constants";
export class BrowserAlgoSigner {
    constructor() {
        this.supportedNetworks = [NETWORKS.BETANET, NETWORKS.TESTNET, NETWORKS.MAINNET];
    }
    async signTxn(unsignedTxn) {
        console.log(unsignedTxn);
        const byteTxn = unsignedTxn.toByte();
        // @ts-ignore
        const b64Txn = AlgoSigner.encoding.msgpackToBase64(byteTxn);
        console.log(b64Txn);
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
    logout() {
    }
}
//# sourceMappingURL=algoSigner.js.map