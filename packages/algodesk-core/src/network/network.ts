import * as sdk from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {Algodv2} from "algosdk";
import {AlgodTokenHeader, CustomTokenHeader, IndexerTokenHeader} from "algosdk/dist/types/src/client/urlTokenBaseHTTPClient";

export class Network {
    public name: string
    public algod: string
    public label: string
    public indexer: string
    public port: string
    public algodToken: string | AlgodTokenHeader | CustomTokenHeader
    public indexerToken: string | IndexerTokenHeader | CustomTokenHeader

    constructor(name: string, label: string, algod: string, indexer: string, algodToken: string | AlgodTokenHeader | CustomTokenHeader = {}, indexerToken: string | IndexerTokenHeader | CustomTokenHeader = {}, port: string = '') {
        this.name = name;
        this.label = label;

        this.port = port;
        this.setAlgodServer(algod, algodToken);
        this.setIndexerServer(indexer, indexerToken);
    }

    setAlgodServer(url: string, algodToken: string | AlgodTokenHeader | CustomTokenHeader = {}) {
        this.algod = url;
        this.algodToken = algodToken;
    }

    setIndexerServer(url: string, indexerToken: string | IndexerTokenHeader | CustomTokenHeader = {}) {
        this.indexer = url;
        this.indexerToken = indexerToken;
    }

    getClient(): Algodv2{
        return new sdk.Algodv2(this.algodToken, this.algod, this.port);
    }

    getIndexer(): IndexerClient {
        return new sdk.Indexer(this.indexerToken, this.indexer, this.port);
    }
}
