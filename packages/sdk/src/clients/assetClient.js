import {BaseClient} from "./baseClient";
import * as sdk from "algosdk";
import {encodeText} from "../utils";

export class AssetClient extends BaseClient{
    constructor(name, signer, wallet) {
        super(name, signer, wallet);
    }

    async get(id) {
        const asset = await this.getClient().getAssetByID(id).do();
        return asset;
    }

    async prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo) {
        const networkParams = await this.getNetworkParams();

        const asset = await this.get(assetId);
        amount = amount * Math.pow(10, asset.params.decimals);

        if(note) {
            note = encodeText(note);
        }

        return sdk.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, networkParams, rekeyTo);
    }

    async transfer(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo) {
        const unsignedTxn = await this.prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }

    async prepareCreateTxn(from, note, total, decimals = 0, defaultFrozen = false, manager, reserve, freeze, clawback, unitName, assetName, assetUrl, assetMetadataHash, rekeyTo) {
        const networkParams = await this.getNetworkParams();

        if(note) {
            note = encodeText(note);
        }

        total = parseInt(total);
        decimals = parseInt(decimals);

        if (assetMetadataHash) {
            assetMetadataHash = new Uint8Array(Buffer.from(assetMetadataHash));
        }

        return sdk.makeAssetCreateTxnWithSuggestedParams(from, note, total, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetUrl, assetMetadataHash, networkParams, rekeyTo);
    }

    async create(from, note, total, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetUrl, assetMetadataHash, rekeyTo) {
        const unsignedTxn = await this.prepareCreateTxn(from, note, total, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetUrl, assetMetadataHash, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }

    async prepareModifyTxn(from, note, assetId, manager, reserve, freeze, clawback, strictEmptyAddressChecking = false, rekeyTo) {
        const networkParams = await this.getNetworkParams();

        if(note) {
            note = encodeText(note);
        }

        return sdk.makeAssetConfigTxnWithSuggestedParams(from, note, assetId, manager, reserve, freeze, clawback, networkParams, strictEmptyAddressChecking, rekeyTo);
    }

    async modify(from, note, assetId, manager, reserve, freeze, clawback, strictEmptyAddressChecking, rekeyTo) {
        const unsignedTxn = await this.prepareModifyTxn(from, note, assetId, manager, reserve, freeze, clawback, strictEmptyAddressChecking, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }

    async prepareDestroyTxn(from, note, assetId, rekeyTo) {
        const networkParams = await this.getNetworkParams();

        if(note) {
            note = encodeText(note);
        }

        return sdk.makeAssetDestroyTxnWithSuggestedParams(from, note, assetId, networkParams, rekeyTo);
    }

    async destroy(from, note, assetId, rekeyTo) {
        const unsignedTxn = await this.prepareDestroyTxn(from, note, assetId, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
}