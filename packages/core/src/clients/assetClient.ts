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
    A_RevokeAssetParams, A_TransferAssetParams, A_Asset
} from "../types";

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

    async get(id: number): Promise<A_Asset>{
        const asset = await this.client.getAssetByID(id).do();
        return asset as A_Asset;
    }

    async prepareTransferTxn(params: A_TransferAssetParams, note?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams: SuggestedParams = await this.transactionClient.getSuggestedParams();

        const {assetId, from, to, closeRemainderTo, revocationTarget, amount} = params;
        const asset: any = await this.get(assetId);
        const amountInDecimals = amount * Math.pow(10, asset.params.decimals);

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amountInDecimals, encodedNote, assetId, suggestedParams, rekeyTo);
    }

    async transfer(params: A_TransferAssetParams, note?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn: Transaction = await this.prepareTransferTxn(params, note, rekeyTo);
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
        const transferParams: A_TransferAssetParams = {
            from: params.from,
            to: params.revokeReceiver,
            assetId: params.assetIndex,
            amount: params.amount,
            revocationTarget: params.revokeTarget
        };

        return this.transfer(transferParams, note);
    }

    async optIn(from: string, assetIndex: number, note?: string): Promise<A_SendTxnResponse> {
        const transferParams: A_TransferAssetParams = {
            from: from,
            to: from,
            assetId: assetIndex,
            amount: 0,
        };

        return this.transfer(transferParams, note);
    }
}