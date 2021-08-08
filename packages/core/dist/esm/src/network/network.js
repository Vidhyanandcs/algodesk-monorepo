import * as sdk from "algosdk";
export class Network {
    constructor(name, label, explorer, algod, indexer, port = '', algodToken = {}, indexerToken = {}) {
        this.name = name;
        this.label = label;
        this.explorer = explorer;
        this.port = port;
        this.setAlgodServer(algod, algodToken);
        this.setIndexerServer(indexer, indexerToken);
    }
    setAlgodServer(url, algodToken) {
        this.algod = url;
        this.algodToken = algodToken;
    }
    setIndexerServer(url, indexerToken) {
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