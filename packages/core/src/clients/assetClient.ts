import {encodeText} from "../utils";
import sdk, {Algodv2, SuggestedParams, Transaction} from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {TransactionClient} from "./transactionClient";
import {Signer} from "../types";

export class AssetClient{
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;

    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
    }

    async get(id: number): Promise<any>{
        const asset = await this.client.getAssetByID(id).do();
        return asset;
    }

    async prepareTransferTxn(from: string, to: string, closeRemainderTo: string | undefined, revocationTarget: string | undefined, amount: number, note: string, assetId: number, rekeyTo: string | undefined): Promise<Transaction> {
        const networkParams: SuggestedParams = await this.transactionClient.getSuggestedParams();

        const asset: any = await this.get(assetId);
        amount = amount * Math.pow(10, asset.params.decimals);

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, encodedNote, assetId, networkParams, rekeyTo);
    }

    async transfer(from: string, to: string, closeRemainderTo: string | undefined, revocationTarget: string | undefined, amount: number, note: string, assetId: number, rekeyTo: string | undefined): Promise<any> {
        const unsignedTxn: Transaction = await this.prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareCreateTxn(from: string, unitName: string, assetName: string, assetUrl: string | undefined, total: number, decimals: number = 0, note: string | undefined, defaultFrozen: boolean = false, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, assetMetadataHash: string | undefined, rekeyTo: string | undefined): Promise<Transaction> {
        const networkParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        let encodedAssetMetadataHash: Uint8Array | undefined;
        if (assetMetadataHash) {
            encodedAssetMetadataHash = new Uint8Array(Buffer.from(assetMetadataHash));
        }

        return sdk.makeAssetCreateTxnWithSuggestedParams(from, encodedNote, total, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetUrl, encodedAssetMetadataHash, networkParams, rekeyTo);
    }

    async create(from: string, unitName: string, assetName: string, assetUrl: string | undefined, total: number, decimals: number = 0, note: string | undefined, defaultFrozen: boolean, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, assetMetadataHash: string | undefined, rekeyTo: string | undefined): Promise<any> {
        const unsignedTxn = await this.prepareCreateTxn(from, unitName, assetName, assetUrl, total, decimals, note, defaultFrozen, manager, reserve, freeze, clawback, assetMetadataHash, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareModifyTxn(from: string, assetId: number, note: string | undefined, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, strictEmptyAddressChecking: boolean = false, rekeyTo: string | undefined): Promise<Transaction> {
        const networkParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetConfigTxnWithSuggestedParams(from, encodedNote, assetId, manager, reserve, freeze, clawback, networkParams, strictEmptyAddressChecking, rekeyTo);
    }

    async modify(from: string, assetId: number, note: string | undefined, manager: string | undefined, reserve: string | undefined, freeze: string | undefined, clawback: string | undefined, strictEmptyAddressChecking: boolean = false, rekeyTo: string | undefined): Promise<any> {
        const unsignedTxn = await this.prepareModifyTxn(from, assetId, note, manager, reserve, freeze, clawback, strictEmptyAddressChecking, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareDestroyTxn(from: string, assetId: number, note: string | undefined, rekeyTo: string | undefined): Promise<Transaction> {
        const networkParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetDestroyTxnWithSuggestedParams(from, encodedNote, assetId, networkParams, rekeyTo);
    }

    async destroy(from: string, assetId: number, note: string | undefined, rekeyTo: string | undefined): Promise<any> {
        const unsignedTxn = await this.prepareDestroyTxn(from, assetId, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

}