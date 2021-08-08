import { BaseClient } from "./baseClient";
import { Algodv2, Transaction } from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { Signer } from "../signers";
export declare class AssetClient extends BaseClient {
    private transactionClient;
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    get(id: number): Promise<any>;
    prepareTransferTxn(from: string, to: string, closeRemainderTo: string | undefined, revocationTarget: string | undefined, amount: number, note: string, assetId: number, rekeyTo: string | undefined): Promise<Transaction>;
    transfer(from: string, to: string, closeRemainderTo: string | undefined, revocationTarget: string | undefined, amount: number, note: string, assetId: number, rekeyTo: string | undefined): Promise<any>;
    prepareCreateTxn(from: string, unitName: string, assetName: string, assetUrl: string | undefined, total: number, decimals: number, note: string | undefined, defaultFrozen: boolean, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, assetMetadataHash: string | undefined, rekeyTo: string | undefined): Promise<Transaction>;
    create(from: string, unitName: string, assetName: string, assetUrl: string | undefined, total: number, decimals: number, note: string | undefined, defaultFrozen: boolean, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, assetMetadataHash: string | undefined, rekeyTo: string | undefined): Promise<any>;
    prepareModifyTxn(from: string, assetId: number, note: string | undefined, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, strictEmptyAddressChecking: boolean, rekeyTo: string | undefined): Promise<Transaction>;
    modify(from: string, assetId: number, note: string | undefined, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, strictEmptyAddressChecking: boolean, rekeyTo: string | undefined): Promise<any>;
    prepareDestroyTxn(from: string, assetId: number, note: string | undefined, rekeyTo: string | undefined): Promise<Transaction>;
    destroy(from: string, assetId: number, note: string | undefined, rekeyTo: string | undefined): Promise<any>;
}
