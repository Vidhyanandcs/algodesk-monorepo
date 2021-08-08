import { BaseClient } from "./baseClient";
import { encodeText } from "../utils";
import sdk from 'algosdk';
import { TransactionClient } from "./transactionClient";
export class AssetClient extends BaseClient {
    constructor(client, indexer, signer) {
        super(client, indexer, signer);
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }
    async get(id) {
        const asset = await this.client.getAssetByID(id).do();
        return asset;
    }
    async prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo) {
        const networkParams = await this.transactionClient.getSuggestedParams();
        const asset = await this.get(assetId);
        amount = amount * Math.pow(10, asset.params.decimals);
        let encodedNote;
        if (note) {
            encodedNote = encodeText(note);
        }
        return sdk.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, encodedNote, assetId, networkParams, rekeyTo);
    }
    async transfer(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo) {
        const unsignedTxn = await this.prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareCreateTxn(from, unitName, assetName, assetUrl, total, decimals = 0, note, defaultFrozen = false, manager, reserve, freeze, clawback, assetMetadataHash, rekeyTo) {
        const networkParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = encodeText(note);
        }
        let encodedAssetMetadataHash;
        if (assetMetadataHash) {
            encodedAssetMetadataHash = new Uint8Array(Buffer.from(assetMetadataHash));
        }
        return sdk.makeAssetCreateTxnWithSuggestedParams(from, encodedNote, total, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetUrl, encodedAssetMetadataHash, networkParams, rekeyTo);
    }
    async create(from, unitName, assetName, assetUrl, total, decimals = 0, note, defaultFrozen, manager, reserve, freeze, clawback, assetMetadataHash, rekeyTo) {
        const unsignedTxn = await this.prepareCreateTxn(from, unitName, assetName, assetUrl, total, decimals, note, defaultFrozen, manager, reserve, freeze, clawback, assetMetadataHash, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareModifyTxn(from, assetId, note, manager, reserve, freeze, clawback, strictEmptyAddressChecking = false, rekeyTo) {
        const networkParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = encodeText(note);
        }
        return sdk.makeAssetConfigTxnWithSuggestedParams(from, encodedNote, assetId, manager, reserve, freeze, clawback, networkParams, strictEmptyAddressChecking, rekeyTo);
    }
    async modify(from, assetId, note, manager, reserve, freeze, clawback, strictEmptyAddressChecking = false, rekeyTo) {
        const unsignedTxn = await this.prepareModifyTxn(from, assetId, note, manager, reserve, freeze, clawback, strictEmptyAddressChecking, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareDestroyTxn(from, assetId, note, rekeyTo) {
        const networkParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = encodeText(note);
        }
        return sdk.makeAssetDestroyTxnWithSuggestedParams(from, encodedNote, assetId, networkParams, rekeyTo);
    }
    async destroy(from, assetId, note, rekeyTo) {
        const unsignedTxn = await this.prepareDestroyTxn(from, assetId, note, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
}
//# sourceMappingURL=assetClient.js.map