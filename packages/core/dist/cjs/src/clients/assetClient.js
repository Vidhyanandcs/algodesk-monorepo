"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetClient = void 0;
const baseClient_1 = require("./baseClient");
const utils_1 = require("../utils");
const algosdk_1 = __importDefault(require("algosdk"));
const transactionClient_1 = require("./transactionClient");
class AssetClient extends baseClient_1.BaseClient {
    constructor(client, indexer, signer) {
        super(client, indexer, signer);
        this.transactionClient = new transactionClient_1.TransactionClient(client, indexer, signer);
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
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, encodedNote, assetId, networkParams, rekeyTo);
    }
    async transfer(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo) {
        const unsignedTxn = await this.prepareTransferTxn(from, to, closeRemainderTo, revocationTarget, amount, note, assetId, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareCreateTxn(from, unitName, assetName, assetUrl, total, decimals = 0, note, defaultFrozen = false, manager, reserve, freeze, clawback, assetMetadataHash, rekeyTo) {
        const networkParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        let encodedAssetMetadataHash;
        if (assetMetadataHash) {
            encodedAssetMetadataHash = new Uint8Array(Buffer.from(assetMetadataHash));
        }
        return algosdk_1.default.makeAssetCreateTxnWithSuggestedParams(from, encodedNote, total, decimals, defaultFrozen, manager, reserve, freeze, clawback, unitName, assetName, assetUrl, encodedAssetMetadataHash, networkParams, rekeyTo);
    }
    async create(from, unitName, assetName, assetUrl, total, decimals = 0, note, defaultFrozen, manager, reserve, freeze, clawback, assetMetadataHash, rekeyTo) {
        const unsignedTxn = await this.prepareCreateTxn(from, unitName, assetName, assetUrl, total, decimals, note, defaultFrozen, manager, reserve, freeze, clawback, assetMetadataHash, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareModifyTxn(from, assetId, note, manager, reserve, freeze, clawback, strictEmptyAddressChecking = false, rekeyTo) {
        const networkParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetConfigTxnWithSuggestedParams(from, encodedNote, assetId, manager, reserve, freeze, clawback, networkParams, strictEmptyAddressChecking, rekeyTo);
    }
    async modify(from, assetId, note, manager, reserve, freeze, clawback, strictEmptyAddressChecking = false, rekeyTo) {
        const unsignedTxn = await this.prepareModifyTxn(from, assetId, note, manager, reserve, freeze, clawback, strictEmptyAddressChecking, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareDestroyTxn(from, assetId, note, rekeyTo) {
        const networkParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetDestroyTxnWithSuggestedParams(from, encodedNote, assetId, networkParams, rekeyTo);
    }
    async destroy(from, assetId, note, rekeyTo) {
        const unsignedTxn = await this.prepareDestroyTxn(from, assetId, note, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
}
exports.AssetClient = AssetClient;
//# sourceMappingURL=assetClient.js.map