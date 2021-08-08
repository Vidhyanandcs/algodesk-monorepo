"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationClient = void 0;
const baseClient_1 = require("./baseClient");
const utils_1 = require("../utils");
const algosdk_1 = __importDefault(require("algosdk"));
const transactionClient_1 = require("./transactionClient");
const application_1 = require("../utils/application");
class ApplicationClient extends baseClient_1.BaseClient {
    constructor(client, indexer, signer) {
        super(client, indexer, signer);
        this.transactionClient = new transactionClient_1.TransactionClient(client, indexer, signer);
    }
    async get(id) {
        return await this.client.getApplicationByID(id).do();
    }
    async prepareOptInTxn(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = application_1.processApplicationArgs(appArgs);
        const encodedNote = utils_1.encodeText(note);
        return algosdk_1.default.makeApplicationOptInTxn(address, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }
    async optIn(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const unsignedTxn = await this.prepareOptInTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareCreateTxn(address, onComplete = algosdk_1.default.OnApplicationComplete.NoOpOC, approvalProgram, clearProgram, localInts = 5, localBytes = 5, globalInts = 5, globalBytes = 5, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = application_1.processApplicationArgs(appArgs);
        const encodedNote = utils_1.encodeText(note);
        return algosdk_1.default.makeApplicationCreateTxn(address, suggestedParams, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }
    async create(address, onComplete = algosdk_1.default.OnApplicationComplete.NoOpOC, approvalProgram, clearProgram, localInts = 5, localBytes = 5, globalInts = 5, globalBytes = 5, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const unsignedTxn = await this.prepareCreateTxn(address, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareInvokeTxn(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = application_1.processApplicationArgs(appArgs);
        const encodedNote = utils_1.encodeText(note);
        return algosdk_1.default.makeApplicationNoOpTxn(address, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }
    async invoke(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const unsignedTxn = await this.prepareInvokeTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareUpdateTxn(address, appId, approvalProgram, clearProgram, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note, lease, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = application_1.processApplicationArgs(appArgs);
        const encodedNote = utils_1.encodeText(note);
        return algosdk_1.default.makeApplicationUpdateTxn(address, suggestedParams, appId, approvalProgram, clearProgram, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote, lease, rekeyTo);
    }
    async update(address, appId, approvalProgram, clearProgram, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note, lease, rekeyTo) {
        const unsignedTxn = await this.prepareUpdateTxn(address, appId, approvalProgram, clearProgram, appArgs, foreignAccounts, foreignApps, foreignAssets, note, lease, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
    async prepareDeleteTxn(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note, lease, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = application_1.processApplicationArgs(appArgs);
        const encodedNote = utils_1.encodeText(note);
        return algosdk_1.default.makeApplicationDeleteTxn(address, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote, lease, rekeyTo);
    }
    async delete(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note, lease, rekeyTo) {
        const unsignedTxn = await this.prepareDeleteTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note, lease, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
    async compileProgram(programSource) {
        const programBytes = utils_1.encodeText(programSource);
        return await this.client.compile(programBytes).do();
    }
}
exports.ApplicationClient = ApplicationClient;
//# sourceMappingURL=applicationClient.js.map