import {Algodv2, SuggestedParams, Transaction, modelsv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {Signer} from "../types";
import SendRawTransaction from "algosdk/dist/types/src/client/v2/algod/sendRawTransaction";
import {
    PendingTransactionResponse,
    PendingTransactionsResponse
} from "algosdk/dist/types/src/client/v2/algod/models/types";
import PendingTransactionInformation from "algosdk/dist/types/src/client/v2/algod/pendingTransactionInformation";

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

    async waitForConfirmation(txId: string): Promise<PendingTransactionResponse> {
        let status = await this.client.status().do();
        let lastRound = status["last-round"];
        while (true) {
            const pendingInfo = await this.client.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                return pendingInfo as PendingTransactionResponse;
            }
            lastRound++;
            await this.client.statusAfterBlock(lastRound).do();
        }
    };

    async pendingTransactionInformation(txId: string): Promise<PendingTransactionResponse> {
        const txDetails = await this.client.pendingTransactionInformation(txId).do() as PendingTransactionResponse;
        return txDetails;
    }

    async get(txId: string): Promise<any> {
        const {transactions} = await this.indexer.searchForTransactions().txid(txId).do();
        return transactions[0];
    }

    async sendTxn(unsignedTxn: Transaction): Promise<any> {
        const rawSignedTxn = await this.signer.signTxn(unsignedTxn);
        return await this.client.sendRawTransaction(rawSignedTxn).do();
    }

    async sendGroupTxns(unsignedTxns: Transaction[]): Promise<any> {
        const rawSignedTxns = await this.signer.signGroupTxns(unsignedTxns);
        return await this.client.sendRawTransaction(rawSignedTxns).do();
    }
}