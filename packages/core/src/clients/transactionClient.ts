import {Algodv2, SuggestedParams, Transaction} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {Signer} from "../types";
import SendRawTransaction from "algosdk/dist/types/src/client/v2/algod/sendRawTransaction";

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

    async waitForConfirmation(txId: string): Promise<void> {
        let status = await this.client.status().do();
        let lastRound = status["last-round"];
        while (true) {
            const pendingInfo = await this.client.pendingTransactionInformation(txId).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                //Got the completed Transaction
                break;
            }
            lastRound++;
            await this.client.statusAfterBlock(lastRound).do();
        }
    };

    async pendingTransactionInformation(txId: string): Promise<any> {
        const txDetails = await this.client.pendingTransactionInformation(txId).do();
        return txDetails;
    }

    async get(txId: string): Promise<any> {
        const {transactions} = await this.indexer.searchForTransactions().txid(txId).do();
        return transactions[0];
    }

    async sendTxn(unsignedTxn: Transaction): Promise<SendRawTransaction> {
        const rawSignedTxn: Uint8Array = await this.signer.signTxn(unsignedTxn);
        return await this.client.sendRawTransaction(rawSignedTxn).do();
    }

    async sendGroupTxns(unsignedTxns: Transaction[]): Promise<SendRawTransaction> {
        const rawSignedTxns: Uint8Array[] = await this.signer.signGroupTxns(unsignedTxns);
        return await this.client.sendRawTransaction(rawSignedTxns).do();
    }
}