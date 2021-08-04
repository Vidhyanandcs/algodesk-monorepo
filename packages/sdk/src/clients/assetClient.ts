import {BaseClient} from "./baseClient";
import {encodeText} from "../utils";
import sdk, {SuggestedParams, Transaction} from 'algosdk';

export class AssetClient extends BaseClient{
    constructor(name: string, signerName: string) {
        super(name, signerName);
    }

    async get(id: number): Promise<any>{
        const asset = await this.getClient().getAssetByID(id).do();
        return asset;
    }

    async prepareTransferTxn(from: string, to: string, closeRemainderTo: string | undefined, revocationTarget: string | undefined, amount: number, note: string, assetId: number, rekeyTo: string | undefined): Promise<Transaction> {
        const networkParams: SuggestedParams = await this.getNetworkParams();

        const asset: any = await this.get(assetId);
        amount = amount * Math.pow(10, asset.params.decimals);

        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, encodedNote, assetId, networkParams, rekeyTo);
    }

    async transfer(from: string, to: string, closeRemainderTo: string | undefined, revocationTarget: string | undefined, amount: number, note: string, assetId: number, rekeyTo: string | undefined) {
        const unsignedTxn: Transaction = await this.prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo);
        //return await this.sendTxn(unsignedTxn);
    }
}