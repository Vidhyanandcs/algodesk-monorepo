"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectSigner = void 0;
const myalgo_connect_1 = __importDefault(require("@randlabs/myalgo-connect"));
const walletconnect_1 = __importDefault(require("walletconnect"));
const algorand_walletconnect_qrcode_modal_1 = __importDefault(require("algorand-walletconnect-qrcode-modal"));
class WalletConnectSigner {
    constructor() {
        this.bridge = "https://bridge.walletconnect.org";
        this.myAlgoConnect = new myalgo_connect_1.default();
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
            const connector = new walletconnect_1.default({ bridge: this.bridge, qrcodeModal: algorand_walletconnect_qrcode_modal_1.default });
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
exports.WalletConnectSigner = WalletConnectSigner;
//# sourceMappingURL=walletConnectSigner.js.map