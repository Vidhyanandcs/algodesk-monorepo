import { encodeText } from "../utils";
import sdk from 'algosdk';
import { TransactionClient } from "./transactionClient";
import { processApplicationArgs } from "../utils/application";
export class ApplicationClient {
    constructor(client, indexer, signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }
    async get(id) {
        return await this.client.getApplicationByID(id).do();
    }
    async prepareOptInTxn(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);
        return sdk.makeApplicationOptInTxn(address, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }
    async optIn(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const unsignedTxn = await this.prepareOptInTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async prepareCreateTxn(address, onComplete = sdk.OnApplicationComplete.NoOpOC, approvalProgram, clearProgram, localInts = 5, localBytes = 5, globalInts = 5, globalBytes = 5, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);
        return sdk.makeApplicationCreateTxn(address, suggestedParams, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }
    async create(address, onComplete = sdk.OnApplicationComplete.NoOpOC, approvalProgram, clearProgram, localInts = 5, localBytes = 5, globalInts = 5, globalBytes = 5, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const unsignedTxn = await this.prepareCreateTxn(address, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async prepareInvokeTxn(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);
        return sdk.makeApplicationNoOpTxn(address, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }
    async invoke(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note) {
        const unsignedTxn = await this.prepareInvokeTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async prepareUpdateTxn(address, appId, approvalProgram, clearProgram, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note, lease, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);
        return sdk.makeApplicationUpdateTxn(address, suggestedParams, appId, approvalProgram, clearProgram, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote, lease, rekeyTo);
    }
    async update(address, appId, approvalProgram, clearProgram, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note, lease, rekeyTo) {
        const unsignedTxn = await this.prepareUpdateTxn(address, appId, approvalProgram, clearProgram, appArgs, foreignAccounts, foreignApps, foreignAssets, note, lease, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async prepareDeleteTxn(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note, lease, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);
        return sdk.makeApplicationDeleteTxn(address, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote, lease, rekeyTo);
    }
    async delete(address, appId, appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note, lease, rekeyTo) {
        const unsignedTxn = await this.prepareDeleteTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note, lease, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
    async compileProgram(programSource) {
        const programBytes = encodeText(programSource);
        return await this.client.compile(programBytes).do();
    }
}
//# sourceMappingURL=applicationClient.js.map