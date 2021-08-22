import MyAlgoConnect from '@randlabs/myalgo-connect';
import WalletConnect from "walletconnect";
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
export class WalletConnectSigner {
    constructor() {
        this.bridge = "https://bridge.walletconnect.org";
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
            const signerAccounts = [];
            const connector = new WalletConnect({ bridge: this.bridge, qrcodeModal: QRCodeModal });
            const connection = await connector.connect();
            const { accounts } = connection;
            accounts.forEach((account) => {
                signerAccounts.push({
                    address: account,
                    name: ''
                });
            });
            return signerAccounts;
        }
        else {
            throw {
                message: "Wallet connect is not installed"
            };
        }
    }
    isInstalled() {
        return true;
    }
}
//# sourceMappingURL=walletConnectSigner.js.map