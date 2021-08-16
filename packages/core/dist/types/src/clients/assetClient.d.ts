import { Algodv2, Transaction } from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { TransactionClient } from "./transactionClient";
import { Signer, A_FreezeAssetParams, A_CreateAssetParams, A_ModifyAssetParams, A_SendTxnResponse } from "../types";
import { Asset } from "algosdk/dist/types/src/client/v2/algod/models/types";
export declare class AssetClient {
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    get(id: number): Promise<Asset>;
    prepareTransferTxn(from: string, to: string, assetId: number, amount: number, note?: string, closeRemainderTo?: string, revocationTarget?: string, rekeyTo?: string): Promise<Transaction>;
    transfer(from: string, to: string, assetId: number, amount: number, note?: string, closeRemainderTo?: string, revocationTarget?: string, rekeyTo?: string): Promise<A_SendTxnResponse>;
    prepareCreateTxn(params: A_CreateAssetParams, note?: string, rekeyTo?: string): Promise<Transaction>;
    create(params: A_CreateAssetParams, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse>;
    prepareModifyTxn(params: A_ModifyAssetParams, note?: string, rekeyTo?: string): Promise<Transaction>;
    modify(params: A_ModifyAssetParams, note?: string, rekeyTo?: string): Promise<any>;
    prepareDestroyTxn(from: string, assetId: number, note?: string, rekeyTo?: string): Promise<Transaction>;
    destroy(from: string, assetId: number, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse>;
    prepareFreezeTxn(params: A_FreezeAssetParams, note?: string, rekeyTo?: string): Promise<Transaction>;
    freeze(params: A_FreezeAssetParams, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse>;
    revoke(from: string, assetIndex: number, revokeTarget: string, revokeReceiver: string, amount: number, note?: string): Promise<A_SendTxnResponse>;
    optIn(from: string, assetIndex: number, note?: string): Promise<A_SendTxnResponse>;
}
