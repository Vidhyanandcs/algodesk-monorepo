"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAlgoWalletSigner = void 0;
const myalgo_connect_1 = __importDefault(require("@randlabs/myalgo-connect"));
class MyAlgoWalletSigner {
    constructor() {
        this.myAlgoConnect = new myalgo_connect_1.default();
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
exports.MyAlgoWalletSigner = MyAlgoWalletSigner;
//# sourceMappingURL=myAlgoWalletSigner.js.map