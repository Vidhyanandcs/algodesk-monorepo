import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";
import * as sdk from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {AlgodTokenHeader, CustomTokenHeader, IndexerTokenHeader} from "algosdk/dist/types/src/client/client";
import {Algodv2, Indexer} from "algosdk";

export class BaseNet {
    name!: string
    algod!: string
    label!: string
    explorer!: string
    indexer!: string
    algosigner!: string
    port!: string
    algodToken: string | AlgodTokenHeader | CustomTokenHeader = {

    }
    indexerToken: string | IndexerTokenHeader | CustomTokenHeader = {

    }
    algodClient: AlgodClient
    indexerClient: IndexerClient

    constructor() {
        this.algodClient = new sdk.Algodv2(this.algodToken, this.algod, this.port);
        this.indexerClient = new sdk.Indexer(this.indexerToken, this.indexer, this.port);
    }

    getLabel(): string {
        return this.label;
    }

    getClient(): Algodv2{
        return this.algodClient;
    }

    getIndexer(): Indexer {
        return this.indexerClient;
    }
}