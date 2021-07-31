import {BaseClient} from "./baseClient";
import * as sdk from "algosdk";
import {prepareNote} from "../utils";

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
            note = prepareNote(note);
        }

        return sdk.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, networkParams, rekeyTo);
    }

    async transfer(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo) {
        const unsignedTxn = this.prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
}