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
const constants_1 = require("../constants");
class WalletConnectSigner {
    constructor() {
        this.bridge = "https://bridge.walletconnect.org";
        this.supportedNetworks = [constants_1.NETWORKS.TESTNET, constants_1.NETWORKS.MAINNET];
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
        const jsonReq = utils_1.formatJsonRpcRequest("algo_signTxn", [requestTxns]);
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
exports.WalletConnectSigner = WalletConnectSigner;
//# sourceMappingURL=walletConnectSigner.js.map