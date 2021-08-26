"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletConnectSigner = void 0;
const algosdk_1 = require("algosdk");
const walletconnect_1 = __importDefault(require("walletconnect"));
const algorand_walletconnect_qrcode_modal_1 = __importDefault(require("algorand-walletconnect-qrcode-modal"));
const utils_1 = require("@json-rpc-tools/utils");
class WalletConnectSigner {
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
                txn: Buffer.from(algosdk_1.encodeUnsignedTransaction(unsignedTxn)).toString("base64")
            };
            requestTxns.push(requestTxn);
        });
        const jsonReq = utils_1.formatJsonRpcRequest("algo_signTxn", requestTxns);
        const signedTxns = await this.connection.sendCustomRequest(jsonReq);
        return signedTxns;
    }
    async connect(name) {
        if (this.isInstalled()) {
            const signerAccounts = [];
            const wc = new walletconnect_1.default({ bridge: this.bridge, qrcodeModal: algorand_walletconnect_qrcode_modal_1.default });
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
exports.WalletConnectSigner = WalletConnectSigner;
//# sourceMappingURL=walletConnectSigner.js.map