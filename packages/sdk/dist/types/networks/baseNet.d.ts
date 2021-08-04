import AlgodClient from "algosdk/dist/types/src/client/v2/algod/algod";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { AlgodTokenHeader, CustomTokenHeader, IndexerTokenHeader } from "algosdk/dist/types/src/client/client";
import { Algodv2, Indexer } from "algosdk";
export declare class BaseNet {
    name: string;
    algod: string;
    label: string;
    explorer: string;
    indexer: string;
    algosigner: string;
    port: string;
    algodToken: string | AlgodTokenHeader | CustomTokenHeader;
    indexerToken: string | IndexerTokenHeader | CustomTokenHeader;
    algodClient: AlgodClient;
    indexerClient: IndexerClient;
    constructor();
    getLabel(): string;
    getClient(): Algodv2;
    getIndexer(): Indexer;
}
