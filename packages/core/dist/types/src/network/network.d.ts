import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { AlgodTokenHeader, CustomTokenHeader, IndexerTokenHeader } from "algosdk/dist/types/src/client/client";
import { Algodv2 } from "algosdk";
export declare class Network {
    name: string;
    algod: string;
    label: string;
    explorer: string;
    indexer: string;
    port: string;
    algodToken: string | AlgodTokenHeader | CustomTokenHeader;
    indexerToken: string | IndexerTokenHeader | CustomTokenHeader;
    constructor(name: string, label: string, explorer: string, algod: string, indexer: string, port?: string, algodToken?: string | AlgodTokenHeader | CustomTokenHeader, indexerToken?: string | IndexerTokenHeader | CustomTokenHeader);
    setAlgodServer(url: string, algodToken: string | AlgodTokenHeader | CustomTokenHeader): void;
    setIndexerServer(url: string, indexerToken: string | IndexerTokenHeader | CustomTokenHeader): void;
    getClient(): Algodv2;
    getIndexer(): IndexerClient;
}
