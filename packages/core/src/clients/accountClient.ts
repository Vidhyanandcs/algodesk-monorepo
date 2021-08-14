import {Algodv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {A_AccountInformation, Signer, A_Asset, A_AssetHolding, A_Application, A_AppsLocalState} from "../types";
import {TransactionClient} from "./transactionClient";

export class AccountClient{
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

    async getAccountInformation(address: string): Promise<A_AccountInformation> {
        const accountInformation = await this.client.accountInformation(address).do() as A_AccountInformation;
        return accountInformation;
    }

    async getCreatedAssets(accountInfo: string | A_AccountInformation): Promise<A_Asset[]>{
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }

        const createdAssets = accountInfo['created-assets'];
        return createdAssets;
    }

    async getHoldingAssets(accountInfo: string | A_AccountInformation): Promise<A_AssetHolding[]>{
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }

        const createdAssets = accountInfo['assets'];
        return createdAssets;
    }

    async getCreatedApps(accountInfo: string | A_AccountInformation): Promise<A_Application[]> {
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }

        const createdApps = accountInfo['created-apps'];
        return createdApps;
    }

    async getOptedApps(accountInfo: string | A_AccountInformation): Promise<A_AppsLocalState[]> {
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }

        const optedApps = accountInfo['apps-local-state'];
        return optedApps;
    }
}