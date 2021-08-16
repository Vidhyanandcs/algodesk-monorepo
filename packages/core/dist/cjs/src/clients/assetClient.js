"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetClient = void 0;
const utils_1 = require("../utils");
const algosdk_1 = __importDefault(require("algosdk"));
const transactionClient_1 = require("./transactionClient");
class AssetClient {
    constructor(client, indexer, signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new transactionClient_1.TransactionClient(client, indexer, signer);
    }
    async get(id) {
        const asset = await this.client.getAssetByID(id).do();
        return asset;
    }
    async prepareTransferTxn(from, to, assetId, amount, note, closeRemainderTo, revocationTarget, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const asset = await this.get(assetId);
        amount = amount * Math.pow(10, asset.params.decimals);
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetTransferTxnWithSuggestedParams(from, to, closeRemainderTo, revocationTarget, amount, encodedNote, assetId, suggestedParams, rekeyTo);
    }
    async transfer(from, to, assetId, amount, note, closeRemainderTo, revocationTarget, rekeyTo) {
        const unsignedTxn = await this.prepareTransferTxn(from, to, assetId, amount, note, closeRemainderTo, revocationTarget, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async prepareCreateTxn(params, note, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetCreateTxnWithSuggestedParams(params.creator, encodedNote, params.total, params.decimals, params.defaultFrozen, params.manager, params.reserve, params.freeze, params.clawback, params.unitName, params.name, params.url, params.metadataHash, suggestedParams, rekeyTo);
    }
    async create(params, note, rekeyTo) {
        const unsignedTxn = await this.prepareCreateTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async prepareModifyTxn(params, note, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetConfigTxnWithSuggestedParams(params.from, encodedNote, params.assetIndex, params.manager, params.reserve, params.freeze, params.clawback, suggestedParams, params.strictEmptyAddressChecking, rekeyTo);
    }
    async modify(params, note, rekeyTo) {
        const unsignedTxn = await this.prepareModifyTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async prepareDestroyTxn(from, assetId, note, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetDestroyTxnWithSuggestedParams(from, encodedNote, assetId, suggestedParams, rekeyTo);
    }
    async destroy(from, assetId, note, rekeyTo) {
        const unsignedTxn = await this.prepareDestroyTxn(from, assetId, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async prepareFreezeTxn(params, note, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makeAssetFreezeTxnWithSuggestedParams(params.from, encodedNote, params.assetIndex, params.freezeAccount, params.freezeState, suggestedParams, rekeyTo);
    }
    async freeze(params, note, rekeyTo) {
        const unsignedTxn = await this.prepareFreezeTxn(params, note, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async revoke(from, assetIndex, revokeTarget, revokeReceiver, amount, note) {
        const to = revokeReceiver;
        return this.transfer(from, to, assetIndex, amount, note, undefined, revokeTarget);
    }
    async optIn(from, assetIndex, note) {
        const to = from;
        const amount = 0;
        return this.transfer(from, to, assetIndex, amount, note);
    }
}
exports.AssetClient = AssetClient;
//# sourceMappingURL=assetClient.js.map