import * as sdk from "algosdk";
import {SIGNERS, networks} from "../constants";
import {WalletSigner, AlgoSigner} from "../signers";

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

    async signTxn(unsignedTxn) {
        const signer = this.getSigner()
        const rawSignedTxn = await signer.signTxn(unsignedTxn);
        return rawSignedTxn;
    }

    async sendTxn(unsignedTxn) {
        const rawSignedTxn = this.signTxn(unsignedTxn);
        return await this.send(rawSignedTxn);
    }

    async signGroupTxns(unsignedTxns) {
        const signer = this.getSigner()
        const rawSignedTxns = await signer.signGroupTxns(unsignedTxns);
        return rawSignedTxns;
    }

    async sendGroupTxns(unsignedTxns) {
        const rawSignedTxns = this.signGroupTxns(unsignedTxns);
        return await this.send(rawSignedTxns);
    }

    async send(rawSignedTxns) {
        return await this.getClient().sendRawTransaction(rawSignedTxns).do();
    }

    async getTransaction(id) {
        const {transactions} = await this.getIndexer().searchForTransactions().txid(id).do();
        return transactions[0];
    }
}