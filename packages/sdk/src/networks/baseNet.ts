import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";
import * as sdk from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {AlgodTokenHeader, CustomTokenHeader, IndexerTokenHeader} from "algosdk/dist/types/src/client/client";
import {Algodv2, Indexer} from "algosdk";

export class BaseNet {
    name: string
    algod: string
    label: string
    explorer: string
    indexer: string
    algosigner: string
    port: string
    algodToken: string | AlgodTokenHeader | CustomTokenHeader
    indexerToken: string | IndexerTokenHeader | CustomTokenHeader

    constructor(name: string, label: string, explorer: string, algod: string, indexer: string, algosigner: string, port: string = '', algodToken: string | AlgodTokenHeader | CustomTokenHeader = {}, indexerToken: string | IndexerTokenHeader | CustomTokenHeader = {}) {
        this.name = name;
        this.label = label;
        this.explorer = explorer;
        this.algod = algod;
        this.port = port;
        this.indexer = indexer;
        this.algosigner = algosigner;
        this.algodToken = algodToken;
        this.indexerToken = indexerToken;
    }

    getLabel(): string {
        return this.label;
    }

    getClient(): Algodv2{
        return new sdk.Algodv2(this.algodToken, this.algod, this.port);
    }

    getIndexer(): Indexer {
        return new sdk.Indexer(this.indexerToken, this.indexer, this.port);
    }
}