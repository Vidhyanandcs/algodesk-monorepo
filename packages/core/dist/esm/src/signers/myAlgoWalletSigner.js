import MyAlgoConnect from '@randlabs/myalgo-connect';
export class MyAlgoWalletSigner {
    constructor() {
        this.myAlgoConnect = new MyAlgoConnect();
    }
    async signTxn(unsignedTxn) {
        const encodedTransactionObj = unsignedTxn.toString();
        const signedTxn = await this.myAlgoConnect.signTransaction(encodedTransactionObj);
        return signedTxn.blob;
    }
    async signGroupTxns(unsignedTxns) {
        const encodedTransactionObjs = [];
        unsignedTxns.forEach((unsignedTxn) => {
            encodedTransactionObjs.push(unsignedTxn.toString());
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
            throw {
                message: "MyAlgo Wallet is not installed"
            };
        }
    }
    isInstalled() {
        return true;
    }
}
//# sourceMappingURL=myAlgoWalletSigner.js.map