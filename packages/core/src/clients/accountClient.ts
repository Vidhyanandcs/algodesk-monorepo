import {Algodv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {Signer} from "../types";
import {TransactionClient} from "./transactionClient";
import {
    Asset,
    AssetHolding,
    Account,
    Application,
    ApplicationLocalState
} from "algosdk/dist/types/src/client/v2/algod/models/types";

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

    async getAccountInformation(address: string): Promise<Account> {
        const accountInformation = await this.client.accountInformation(address).do() as Account;
        return accountInformation;
    }

    async getCreatedAssets(accountInfo: string | Account): Promise<Asset[]>{
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }

        const createdAssets = accountInfo['created-assets'];
        return createdAssets;
    }

    async getHoldingAssets(accountInfo: string | Account): Promise<AssetHolding[]>{
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }

        const createdAssets = accountInfo['assets'];
        return createdAssets;
    }

    async getCreatedApps(accountInfo: string | Account): Promise<Application[]> {
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }

        const createdApps = accountInfo['created-apps'];
        return createdApps;
    }

    async getOptedApps(accountInfo: string | Account): Promise<Application[]> {
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }

        const optedApps = accountInfo['apps-local-state'];
        return optedApps;
    }
}