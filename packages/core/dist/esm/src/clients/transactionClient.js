import { BaseClient } from "./baseClient";
export class TransactionClient extends BaseClient {
    constructor(client, indexer, signer) {
        super(client, indexer, signer);
    }
    async getSuggestedParams() {
        const params = await this.client.getTransactionParams().do();
        return params;
    }
    async waitForConfirmation(txId) {
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
    }
    ;
    async pendingTransactionInformation(txId) {
        const txDetails = await this.client.pendingTransactionInformation(txId).do();
        return txDetails;
    }
    async get(txId) {
        const { transactions } = await this.indexer.searchForTransactions().txid(txId).do();
        return transactions[0];
    }
}
//# sourceMappingURL=transactionClient.js.map