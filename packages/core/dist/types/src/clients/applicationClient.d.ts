import { Algodv2, OnApplicationComplete, Transaction } from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { TransactionClient } from "./transactionClient";
import { Signer } from "../types";
export declare class ApplicationClient {
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    get(id: number): Promise<any>;
    prepareOptInTxn(address: string, appId: number, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined): Promise<Transaction>;
    optIn(address: string, appId: number, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined): Promise<any>;
    prepareCreateTxn(address: string, onComplete: OnApplicationComplete, approvalProgram: Uint8Array, clearProgram: Uint8Array, localInts: number, localBytes: number, globalInts: number, globalBytes: number, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined): Promise<Transaction>;
    create(address: string, onComplete: OnApplicationComplete, approvalProgram: Uint8Array, clearProgram: Uint8Array, localInts: number, localBytes: number, globalInts: number, globalBytes: number, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined): Promise<any>;
    prepareInvokeTxn(address: string, appId: number, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined): Promise<Transaction>;
    invoke(address: string, appId: number, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined): Promise<any>;
    prepareUpdateTxn(address: string, appId: number, approvalProgram: Uint8Array, clearProgram: Uint8Array, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined, lease: Uint8Array, rekeyTo: string): Promise<Transaction>;
    update(address: string, appId: number, approvalProgram: Uint8Array, clearProgram: Uint8Array, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined, lease: Uint8Array, rekeyTo: string): Promise<any>;
    prepareDeleteTxn(address: string, appId: number, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined, lease: Uint8Array, rekeyTo: string): Promise<Transaction>;
    delete(address: string, appId: number, appArgs: any[], foreignAccounts: string[], foreignApps: number[], foreignAssets: number[], note: string | undefined, lease: Uint8Array, rekeyTo: string): Promise<any>;
    compileProgram(programSource: string): Promise<any>;
}
