import {Algodv2, SuggestedParams, Transaction, assignGroupID} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {Signer, A_PendingTransactionResponse, A_SendTxnResponse} from "../types";

export class TransactionClient{
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;

    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
    }

    async getSuggestedParams(): Promise<SuggestedParams> {
        const params: SuggestedParams = await this.client.getTransactionParams().do();
        return params;
    }

    async waitForConfirmation(txId: string): Promise<A_PendingTransactionResponse> {
        const status = await this.client.status().do();
        let lastRound = status["last-round"];
        while (true) {
            const pendingInfo = await this.client.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                return pendingInfo as A_PendingTransactionResponse;
            }
            lastRound++;
            await this.client.statusAfterBlock(lastRound).do();
        }
    };

    async waitForBlock(blockNumber: number): Promise<void> {
        let status = await this.client.status().do();
        let lastRound = status["last-round"];
        while (true) {
            status = await this.client.status().do();
            lastRound = status["last-round"];
            if (lastRound > blockNumber) {
                return;
            }
            lastRound++;
            await this.client.statusAfterBlock(lastRound).do();
        }
    };

    async pendingTransactionInformation(txId: string): Promise<A_PendingTransactionResponse> {
        const txDetails = await this.client.pendingTransactionInformation(txId).do() as A_PendingTransactionResponse;
        return txDetails;
    }

    async get(txId: string): Promise<any> {
        const {transactions} = await this.indexer.searchForTransactions().txid(txId).do();
        return transactions[0];
    }

    async sendTxn(unsignedTxn: Transaction): Promise<A_SendTxnResponse> {
        const rawSignedTxn = await this.signer.signTxn(unsignedTxn);
        return await this.client.sendRawTransaction(rawSignedTxn).do();
    }

    async sendGroupTxns(unsignedTxns: Transaction[]): Promise<any> {
        const rawSignedTxns = await this.signer.signGroupTxns(unsignedTxns);
        return await this.client.sendRawTransaction(rawSignedTxns).do();
    }

    assignGroupID(unsignedTransactions: Transaction[]): Transaction[] {
        return assignGroupID(unsignedTransactions);
    }

    async getCurrentRound(): Promise<number> {
        const suggestedParams = await this.getSuggestedParams();
        return suggestedParams.firstRound;
    }
}