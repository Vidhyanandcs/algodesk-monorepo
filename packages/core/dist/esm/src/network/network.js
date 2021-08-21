import * as sdk from "algosdk";
export class Network {
    constructor(name, label, algod, indexer, algodToken = {}, indexerToken = {}, port = '') {
        this.name = name;
        this.label = label;
        this.port = port;
        this.setAlgodServer(algod, algodToken);
        this.setIndexerServer(indexer, indexerToken);
    }
    setAlgodServer(url, algodToken = {}) {
        this.algod = url;
        this.algodToken = algodToken;
    }
    setIndexerServer(url, indexerToken = {}) {
        this.indexer = url;
        this.indexerToken = indexerToken;
    }
    getClient() {
        return new sdk.Algodv2(this.algodToken, this.algod, this.port);
    }
    getIndexer() {
        return new sdk.Indexer(this.indexerToken, this.indexer, this.port);
    }
}
//# sourceMappingURL=network.js.map