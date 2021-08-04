"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetClient = void 0;
const baseClient_1 = require("./baseClient");
const utils_1 = require("../utils");
const algosdk_1 = __importDefault(require("algosdk"));
class AssetClient extends baseClient_1.BaseClient {
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
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, encodedNote, assetId, networkParams, rekeyTo);
    }
    async transfer(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo) {
        const unsignedTxn = await this.prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo);
        //return await this.sendTxn(unsignedTxn);
    }
}
exports.AssetClient = AssetClient;
//# sourceMappingURL=assetClient.js.map