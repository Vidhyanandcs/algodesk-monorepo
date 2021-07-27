import * as sdk from "algosdk";
import {SIGNERS, networks} from "../constants";
import WalletSigner from "../signers/walletSigner";
import AlgoSigner from "../signers/algoSigner";

export class BaseClient {
    constructor(name, signer, wallet) {
        this.selectNetwork(name);
        this.selectSigner(signer, wallet);
    }

    selectNetwork(name) {
        networks.forEach((network) => {
            if (network.name === name) {
                this.prepareClients(network);
            }
        })
    }

    prepareClients(network) {
        const {algod, indexer, token, port} = network

        this.setNetwork(network);
        this.setClient(new sdk.Algodv2(token, algod, port));
        this.setIndexer(new sdk.Indexer(token, indexer, port));
    }

    setNetwork(network) {
        this.network = network;
    }

    getNetwork() {
        return this.network;
    }

    setClient(client) {
        this.client = client;
    }

    getClient() {
        return this.client;
    }

    setIndexer(indexer) {
        this.indexer = indexer;
    }

    getIndexer() {
        return this.indexer;
    }

    async getNetworkParams() {
        const params = await this.getClient().getTransactionParams().do();
        return params;
    }

    selectSigner(signer, wallet) {
        let signerInstance;

        if (signer == SIGNERS.WALLET) {
            signerInstance = new WalletSigner(wallet);
        }
        else if(signer == SIGNERS.ALGO_SIGNER) {
            signerInstance = new AlgoSigner();
        }

        this.setSigner(signerInstance);
    }

    setSigner(signerInstance) {
        this.signer = signerInstance;
    }

    getSigner() {
        return this.signer;
    }

    async sendTxn(unsignedTxn) {
        const signer = this.getSigner()
        if (!signer) {
            throw "signer not configured";
            return;
        }

        const rawSignedTxn = await signer.signTxn(unsignedTxn);

        const transaction = await this.getClient().sendRawTransaction(rawSignedTxn).do();
        return transaction;
    }
}