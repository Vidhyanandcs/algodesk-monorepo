import {encodeText} from "../utils";
import sdk, {Algodv2, SuggestedParams, Transaction} from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {TransactionClient} from "./transactionClient";
import {
    Signer,
    A_FreezeAssetParams,
    A_CreateAssetParams,
    A_ModifyAssetParams,
    A_SendTxnResponse,
    A_RevokeAssetParams
} from "../types";
import {Asset} from "algosdk/dist/types/src/client/v2/algod/models/types";

export class AssetClient{
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;

    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }

    async get(id: number): Promise<Asset>{
        const asset = await this.client.getAssetByID(id).do();
        return asset as Asset;
    }

    async prepareTransferTxn(from: string, to: string, assetId: number, amount: number, note?: string, closeRemainderTo?: string, revocationTarget?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams: SuggestedParams = await this.transactionClient.getSuggestedParams();

        const asset: any = await this.get(assetId);
        amount = amount * Math.pow(10, asset.params.decimals);

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, encodedNote, assetId, suggestedParams, rekeyTo);
    }

    async transfer(from: string, to: string, assetId: number, amount: number, note?: string, closeRemainderTo?: string, revocationTarget?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn: Transaction = await this.prepareTransferTxn(from, to, assetId, amount, note, closeRemainderTo, revocationTarget, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareCreateTxn(params: A_CreateAssetParams, note?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        // @ts-ignore
        const totalSupply = params.total * Math.pow(10, params.decimals);

        return sdk.makeAssetCreateTxnWithSuggestedParams(params.creator, encodedNote, totalSupply, params.decimals, params.defaultFrozen, params.manager, params.reserve, params.freeze, params.clawback, params.unitName, params.name, params.url, params.metadataHash, suggestedParams, rekeyTo);
    }

    async create(params: A_CreateAssetParams, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareCreateTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareModifyTxn(params: A_ModifyAssetParams, note?:string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetConfigTxnWithSuggestedParams(params.from, encodedNote, params.assetIndex, params.manager, params.reserve, params.freeze, params.clawback, suggestedParams, params.strictEmptyAddressChecking, rekeyTo);
    }

    async modify(params: A_ModifyAssetParams, note?:string, rekeyTo?: string): Promise<any> {
        const unsignedTxn = await this.prepareModifyTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareDestroyTxn(from: string, assetId: number, note?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetDestroyTxnWithSuggestedParams(from, encodedNote, assetId, suggestedParams, rekeyTo);
    }

    async destroy(from: string, assetId: number, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareDestroyTxn(from, assetId, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareFreezeTxn(params: A_FreezeAssetParams, note?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetFreezeTxnWithSuggestedParams(params.from, encodedNote, params.assetIndex, params.freezeAccount, params.freezeState, suggestedParams, rekeyTo);
    }

    async freeze(params: A_FreezeAssetParams, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareFreezeTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async revoke(params: A_RevokeAssetParams, note?: string): Promise<A_SendTxnResponse> {
        const to = params.revokeReceiver;
        return this.transfer(params.from, to, params.assetIndex, params.amount, note, undefined, params.revokeTarget);
    }

    async optIn(from: string, assetIndex: number, note?: string): Promise<A_SendTxnResponse> {
        const to = from;
        const amount = 0;
        return this.transfer(from, to, assetIndex, amount, note);
    }
}