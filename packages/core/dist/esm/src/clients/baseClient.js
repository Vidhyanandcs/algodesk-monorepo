export class BaseClient {
    constructor(client, indexer, signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
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
//# sourceMappingURL=baseClient.js.map