import MyAlgoConnect from '@randlabs/myalgo-connect';
import { NETWORKS } from "../constants";
export class MyAlgoWalletSigner {
    constructor() {
        this.myAlgoConnect = new MyAlgoConnect();
        this.supportedNetworks = [NETWORKS.BETANET, NETWORKS.TESTNET, NETWORKS.MAINNET];
    }
    async signTxn(unsignedTxn) {
        const byteTxn = unsignedTxn.toByte();
        const signedTxn = await this.myAlgoConnect.signTransaction(byteTxn);
        return signedTxn.blob;
    }
    async signGroupTxns(unsignedTxns) {
        const encodedTransactionObjs = [];
        unsignedTxns.forEach((unsignedTxn) => {
            encodedTransactionObjs.push(unsignedTxn.toByte());
        });
        const blobs = [];
        const signedTxns = await this.myAlgoConnect.signTransaction(encodedTransactionObjs);
        signedTxns.forEach((signedTxn) => {
            blobs.push(signedTxn.blob);
        });
        return blobs;
    }
    async connect(name) {
        if (this.isInstalled()) {
            if (this.isNetworkSupported(name)) {
                const accounts = [];
                const wallets = await this.myAlgoConnect.connect();
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
                throw new Error(name + " is not supported by MyAlgo Wallet");
            }
        }
        else {
            throw new Error("MyAlgo Wallet is not installed");
        }
    }
    isInstalled() {
        return true;
    }
    isNetworkSupported(name) {
        return this.supportedNetworks.indexOf(name) !== -1;
    }
}
//# sourceMappingURL=myAlgoWalletSigner.js.map