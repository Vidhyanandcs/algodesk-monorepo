"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAlgoWalletSigner = void 0;
const myalgo_connect_1 = __importDefault(require("@randlabs/myalgo-connect"));
const constants_1 = require("../constants");
class MyAlgoWalletSigner {
    constructor() {
        this.myAlgoConnect = new myalgo_connect_1.default();
        this.supportedNetworks = [constants_1.NETWORKS.BETANET, constants_1.NETWORKS.TESTNET, constants_1.NETWORKS.MAINNET];
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
exports.MyAlgoWalletSigner = MyAlgoWalletSigner;
//# sourceMappingURL=myAlgoWalletSigner.js.map