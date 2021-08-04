import * as sdk from "algosdk";
export class BaseNet {
    constructor() {
        this.algodToken = {};
        this.indexerToken = {};
        this.algodClient = new sdk.Algodv2(this.algodToken, this.algod, this.port);
        this.indexerClient = new sdk.Indexer(this.indexerToken, this.indexer, this.port);
    }
    getLabel() {
        return this.label;
    }
    getClient() {
        return this.algodClient;
    }
    getIndexer() {
        return this.indexerClient;
    }
}
//# sourceMappingURL=baseNet.js.map