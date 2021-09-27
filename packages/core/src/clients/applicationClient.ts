import {encodeText} from "../utils";
import sdk, {Algodv2, OnApplicationComplete, Transaction} from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {TransactionClient} from "./transactionClient";
import {A_CreateApplicationParams, A_SendTxnResponse, A_InvokeApplicationParams, Signer} from "../types";
import {processApplicationArgs} from "../utils/application";

export class ApplicationClient{
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;

    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }

    async get(id: number): Promise<any> {
        return await this.client.getApplicationByID(id).do();
    }

    async prepareOptInTxn(address: string, appId: number, appArgs: any[] = [], foreignAccounts: string[] = [], foreignApps: number[] = [], foreignAssets: number[] = [], note: string | undefined): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);

        return  sdk.makeApplicationOptInTxn(address, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote);
    }

    async optIn(address: string, appId: number, appArgs: any[] = [], foreignAccounts: string[] = [], foreignApps: number[] = [], foreignAssets: number[] = [], note: string | undefined): Promise<any> {
        const unsignedTxn = await this.prepareOptInTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note);
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

    async invoke(params: A_InvokeApplicationParams, note?: string): Promise<any> {
        const unsignedTxn = await this.prepareInvokeTxn(params, note);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareUpdateTxn(address: string, appId : number, approvalProgram: Uint8Array, clearProgram: Uint8Array, appArgs: any[] = [], foreignAccounts: string[] = [], foreignApps: number[] = [], foreignAssets: number[] = [], note: string | undefined, lease: Uint8Array, rekeyTo: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);

        return sdk.makeApplicationUpdateTxn(address, suggestedParams, appId, approvalProgram, clearProgram, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote, lease, rekeyTo);
    }

    async update(address: string, appId : number, approvalProgram: Uint8Array, clearProgram: Uint8Array, appArgs: any[] = [], foreignAccounts: string[] = [], foreignApps: number[] = [], foreignAssets: number[] = [], note: string | undefined, lease: Uint8Array, rekeyTo: string): Promise<any> {
        const unsignedTxn = await this.prepareUpdateTxn(address, appId, approvalProgram, clearProgram, appArgs, foreignAccounts, foreignApps, foreignAssets, note, lease, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async prepareDeleteTxn(address: string, appId : number, appArgs: any[] = [], foreignAccounts: string[] = [], foreignApps: number[] = [], foreignAssets: number[] = [], note: string | undefined, lease: Uint8Array, rekeyTo: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        const appArgsUint = processApplicationArgs(appArgs);
        const encodedNote = encodeText(note);

        return sdk.makeApplicationDeleteTxn(address, suggestedParams, appId, appArgsUint, foreignAccounts, foreignApps, foreignAssets, encodedNote, lease, rekeyTo);
    }

    async delete(address: string, appId : number, appArgs: any[] = [], foreignAccounts: string[] = [], foreignApps: number[] = [], foreignAssets: number[] = [], note: string | undefined, lease: Uint8Array, rekeyTo: string): Promise<any> {
        const unsignedTxn = await this.prepareDeleteTxn(address, appId, appArgs, foreignAccounts, foreignApps, foreignAssets, note, lease, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }

    async compileProgram(programSource: string): Promise<any> {
        const programBytes = encodeText(programSource);
        return await this.client.compile(programBytes).do();
    }
}