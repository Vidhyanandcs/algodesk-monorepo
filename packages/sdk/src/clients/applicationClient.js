import {BaseClient} from "./baseClient";
import * as sdk from "algosdk";
import {processApplicationInputs} from "../utils";

export class ApplicationClient extends BaseClient{
    constructor(name, signer, wallet) {
        super(name, signer, wallet);
    }


    async prepareOptInTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note) {
        const networkParams = await this.getNetworkParams();

        const processedInputs = processApplicationInputs(appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        appArgs = processedInputs.appArgs;
        foreignAccounts = processedInputs.foreignAccounts;
        foreignApps = processedInputs.foreignApps;
        foreignAssets = processedInputs.foreignAssets;
        note = processedInputs.note;

        return  sdk.makeApplicationOptInTxn(address, networkParams, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
    }

    async optIn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note) {
        const unsignedTxn = this.prepareOptInTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.sendTxn(unsignedTxn);
    }

    async prepareCreateTxn(address, onComplete = sdk.OnApplicationComplete.NoOpOC, approvalProgram, clearProgram, localInts = 5, localBytes = 5, globalInts = 5, globalBytes = 5, appArgs, foreignAccounts, foreignApps, foreignAssets, note) {
        const networkParams = await this.getNetworkParams();

        const processedInputs = processApplicationInputs(appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        appArgs = processedInputs.appArgs;
        foreignAccounts = processedInputs.foreignAccounts;
        foreignApps = processedInputs.foreignApps;
        foreignAssets = processedInputs.foreignAssets;
        note = processedInputs.note;

        return sdk.makeApplicationCreateTxn(address, networkParams, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
    }

    async create(address, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, appArgs, foreignAccounts, foreignApps, foreignAssets, note) {
        const unsignedTxn = this.prepareCreateTxn(address, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.sendTxn(unsignedTxn);
    }

    async prepareInvokeTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note) {
        const networkParams = await this.getNetworkParams();

        const processedInputs = processApplicationInputs(appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        appArgs = processedInputs.appArgs;
        foreignAccounts = processedInputs.foreignAccounts;
        foreignApps = processedInputs.foreignApps;
        foreignAssets = processedInputs.foreignAssets;
        note = processedInputs.note;

        return sdk.makeApplicationNoOpTxn(address, networkParams, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
    }

    async invoke(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note) {
        const unsignedTxn = this.prepareInvokeTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
        return await this.sendTxn(unsignedTxn);
    }

    async compileProgram(programSource) {
        const client = this.getClient();
        const encoder = new TextEncoder();
        const programBytes = encoder.encode(programSource);
        return await client.compile(programBytes).do();
    }
}