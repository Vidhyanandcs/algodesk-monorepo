import {Signer, SignerAccount} from "../types";
import {Transaction, encodeUnsignedTransaction} from "algosdk";
import WalletConnect from "walletconnect";
import QRCodeModal from 'algorand-walletconnect-qrcode-modal';
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import {NETWORKS} from "../constants";

export class WalletConnectSigner implements Signer{
    public bridge: string = "https://bridge.walletconnect.org";
    public connection;
    private supportedNetworks: string[];

    constructor() {
        this.supportedNetworks = [NETWORKS.TESTNET, NETWORKS.MAINNET];
    }

    async signTxn(unsignedTxn: Transaction): Promise<Uint8Array> {
        const signedTxns = await this.signGroupTxns([unsignedTxn]);
        return signedTxns[0];
    }

    async signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]> {
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

    async connect(name: string): Promise<SignerAccount[]> {
        if (this.isInstalled()) {
            if (this.isNetworkSupported(name)) {
                const signerAccounts: SignerAccount[] = [];

                const wc = new WalletConnect({ bridge: this.bridge, qrcodeModal: QRCodeModal });
                const connection = await wc.connect();
                this.connection = connection;
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
                throw new Error(name + " is not supported by WalletConnect");
            }
        }
        else {
            throw new Error("Wallet connect is not installed");
        }
    }

    isInstalled(): boolean {
        return true;
    }

    isNetworkSupported(name: string): boolean {
        return this.supportedNetworks.indexOf(name) !== -1;
    }

    logout() {
        this.connection.killSession();
    }
}