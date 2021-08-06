import {BaseClient} from "./baseClient";
import {Algodv2, SuggestedParams} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import Status from "algosdk/dist/types/src/client/v2/algod/status";
import PendingTransactionInformation from "algosdk/dist/types/src/client/v2/algod/pendingTransactionInformation";
import {BaseSigner} from "../signers";

export class TransactionClient extends BaseClient{
    constructor(client: Algodv2, indexer: IndexerClient, signer: BaseSigner) {
        super(client, indexer, signer);
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

    async pendingTransactionInformation(txId: string): Promise<Record<string, any>> {
        const txDetails = await this.client.pendingTransactionInformation(txId).do();
        return txDetails;
    }
}