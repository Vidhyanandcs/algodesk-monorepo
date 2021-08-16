"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionClient = void 0;
class TransactionClient {
    constructor(client, indexer, signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
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
                return pendingInfo;
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
    async sendTxn(unsignedTxn) {
        const rawSignedTxn = await this.signer.signTxn(unsignedTxn);
        return await this.client.sendRawTransaction(rawSignedTxn).do();
    }
    async sendGroupTxns(unsignedTxns) {
        const rawSignedTxns = await this.signer.signGroupTxns(unsignedTxns);
        return await this.client.sendRawTransaction(rawSignedTxns).do();
    }
}
exports.TransactionClient = TransactionClient;
//# sourceMappingURL=transactionClient.js.map