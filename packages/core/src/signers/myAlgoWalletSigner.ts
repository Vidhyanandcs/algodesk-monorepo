import {Signer, SignerAccount} from "../types";
import {Transaction} from "algosdk";
import MyAlgoConnect, {Accounts, AlgorandTxn} from '@randlabs/myalgo-connect';


export class MyAlgoWalletSigner implements Signer{
    private readonly myAlgoConnect: MyAlgoConnect;

    constructor() {
        this.myAlgoConnect = new MyAlgoConnect();
    }

    async signTxn(unsignedTxn: Transaction): Promise<Uint8Array> {
        const byteTxn = unsignedTxn.toByte();
        const signedTxn = await this.myAlgoConnect.signTransaction(byteTxn);
        return signedTxn.blob;
    }

    async signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]> {
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

    async connect(name: string): Promise<SignerAccount[]> {
        if (this.isInstalled()) {
            const accounts: SignerAccount[] = [];
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

    isInstalled(): boolean {
        return true;
    }
}