import { encodeUnsignedTransaction } from "algosdk";
import WalletConnect from "walletconnect";
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import { NETWORKS } from "../constants";
export class WalletConnectSigner {
    constructor() {
        this.bridge = "https://bridge.walletconnect.org";
        this.supportedNetworks = [NETWORKS.TESTNET, NETWORKS.MAINNET];
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
        let signedTxns = await this.connection.sendCustomRequest(jsonReq);
        signedTxns = signedTxns.map((signedTxn) => {
            const rawSignedTxn = Buffer.from(signedTxn, "base64");
            return new Uint8Array(rawSignedTxn);
        });
        return signedTxns;
    }
    async connect(name) {
        if (this.isInstalled()) {
            if (this.isNetworkSupported(name)) {
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
                throw new Error(name + " is not supported by WalletConnect");
            }
        }
        else {
            throw new Error("Wallet connect is not installed");
        }
    }
    isInstalled() {
        return true;
    }
    isNetworkSupported(name) {
        return this.supportedNetworks.indexOf(name) !== -1;
    }
}
//# sourceMappingURL=walletConnectSigner.js.map