import {Signer, SignerAccount} from "../types";
import {Transaction} from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';
import WalletConnect from "walletconnect";
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';


export class WalletConnectSigner implements Signer{
    private readonly myAlgoConnect: MyAlgoConnect;
    public bridge: string = "https://bridge.walletconnect.org";

    constructor() {
        this.myAlgoConnect = new MyAlgoConnect();
    }

    async signTxn(unsignedTxn: Transaction): Promise<Uint8Array> {
        const encodedTransactionObj = unsignedTxn.toString();
        const signedTxn = await this.myAlgoConnect.signTransaction(encodedTransactionObj);
        return signedTxn.blob;
    }

    async signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]> {
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

    async connect(name: string): Promise<SignerAccount[]> {
        if (this.isInstalled()) {
            const signerAccounts: SignerAccount[] = [];

            const connector = new WalletConnect({ bridge: this.bridge, qrcodeModal: QRCodeModal });
            const connection = await connector.connect();
            const {accounts} = connection;

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

    isInstalled(): boolean {
        return true;
    }
}