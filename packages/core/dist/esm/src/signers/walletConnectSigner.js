import { encodeUnsignedTransaction } from "algosdk";
import WalletConnect from "walletconnect";
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
export class WalletConnectSigner {
    constructor() {
        this.bridge = "https://bridge.walletconnect.org";
    }
    async signTxn(unsignedTxn) {
        const signedTxns = await this.signGroupTxns([unsignedTxn]);
        return signedTxns[0];
    }
    async signGroupTxns(unsignedTxns) {
        const requestTxns = [];
        unsignedTxns.forEach((unsignedTxn) => {
            const requestTxn = {
                txn: Buffer.from(encodeUnsignedTransaction(unsignedTxn)).toString("base64")
            };
            requestTxns.push(requestTxn);
        });
        const jsonReq = formatJsonRpcRequest("algo_signTxn", [requestTxns]);
        const signedTxns = await this.connection.sendCustomRequest(jsonReq);
        return signedTxns;
    }
    async connect(name) {
        if (this.isInstalled()) {
            const signerAccounts = [];
            const wc = new WalletConnect({ bridge: this.bridge, qrcodeModal: QRCodeModal });
            const connection = await wc.connect();
            this.connection = connection;
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