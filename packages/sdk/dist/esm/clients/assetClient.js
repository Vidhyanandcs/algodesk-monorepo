import { BaseClient } from "./baseClient";
import { encodeText } from "../utils";
import sdk from 'algosdk';
export class AssetClient extends BaseClient {
    constructor(name, signerName) {
        super(name, signerName);
    }
    async get(id) {
        const asset = await this.getClient().getAssetByID(id).do();
        return asset;
    }
    async prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo) {
        const networkParams = await this.getNetworkParams();
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
        //return await this.sendTxn(unsignedTxn);
    }
}
//# sourceMappingURL=assetClient.js.map