import {encodeText} from "../utils";
import sdk, {Algodv2, Transaction} from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {TransactionClient} from "./transactionClient";
import {
    A_CreateApplicationParams,
    A_SendTxnResponse,
    A_InvokeApplicationParams,
    Signer,
    A_OptInApplicationParams,
    A_DeleteApplicationParams,
    A_SearchTransactions,
    A_UpdateApplicationParams, A_AccountInformation, A_Application
} from "../types";
import {processApplicationArgs} from "../utils/application";
import {AccountClient} from "./accountClient";

export class ApplicationClient{
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;
    accountClient: AccountClient;

    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new TransactionClient(client, indexer, signer);
        this.accountClient = new AccountClient(client, indexer, signer);
    }

    async get(id: number): Promise<A_Application> {
        const app = await this.client.getApplicationByID(id).do();
        return app as A_Application;
    }

    async prepareOptInTxn(params: A_OptInApplicationParams, note?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        const {from, appId, appArgs, foreignAccounts, foreignApps, foreignAssets} = params;
        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);

        return  sdk.makeApplicationOptInTxn(from, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }

    async optIn(params: A_OptInApplicationParams, note?: string): Promise<any> {
        const unsignedTxn = await this.prepareOptInTxn(params, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareCreateTxn(params: A_CreateApplicationParams, note?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        const {appArgs, from, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, foreignAccounts, foreignApps, foreignAssets} = params;

        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);

        return sdk.makeApplicationCreateTxn(from, suggestedParams, onComplete, approvalProgram, clearProgram, localInts, localBytes, globalInts, globalBytes, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }

    async create(params: A_CreateApplicationParams, note?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareCreateTxn(params, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareInvokeTxn(params: A_InvokeApplicationParams, note?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        const {appArgs, from, appId, foreignApps, foreignAssets, foreignAccounts} = params;
        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);

        return sdk.makeApplicationNoOpTxn(from, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }

    async invoke(params: A_InvokeApplicationParams, note?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareInvokeTxn(params, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareUpdateTxn(params: A_UpdateApplicationParams, note?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        const {appArgs, from, appId, approvalProgram, clearProgram, foreignApps, foreignAssets, foreignAccounts, lease, rekeyTo} = params;

        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);

        return sdk.makeApplicationUpdateTxn(from, suggestedParams, appId, approvalProgram, clearProgram, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote, lease, rekeyTo);
    }

    async update(params: A_UpdateApplicationParams, note?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareUpdateTxn(params, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareDeleteTxn(params: A_DeleteApplicationParams, note?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        const {from, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, lease, rekeyTo} = params;
        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);

        return sdk.makeApplicationDeleteTxn(from, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote, lease, rekeyTo);
    }

    async delete(params: A_DeleteApplicationParams, note?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.prepareDeleteTxn(params, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async compileProgram(programSource: string): Promise<any> {
        const programBytes = encodeText(programSource);
        return await this.client.compile(programBytes).do();
    }

    async getAccountTransactions(appId: number, address: string): Promise<A_SearchTransactions> {
        const txs = await this.indexer.searchForTransactions().address(address).applicationID(appId).do();
        return txs as A_SearchTransactions;
    }

    async getAppTransactions(appId: number): Promise<A_SearchTransactions> {
        const txs = await this.indexer.searchForTransactions().applicationID(appId).do();
        return txs as A_SearchTransactions;
    }

    hasOpted(accountInfo: A_AccountInformation, appId: number): boolean {
        const optedApps = this.accountClient.getOptedApps(accountInfo);

        let opted = false;
        optedApps.forEach((app) => {
            if (app.id == appId) {
                opted = true;
            }
        });

        return opted;
    }
}