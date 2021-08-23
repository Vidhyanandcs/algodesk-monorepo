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

    getCreatedAssets(accountInfo: A_AccountInformation): A_Asset[]{
        const createdAssets = accountInfo['created-assets'];
        return createdAssets;
    }

    getHoldingAssets(accountInfo: A_AccountInformation): A_AssetHolding[]{
        const createdAssets = accountInfo['assets'];
        return createdAssets;
    }

    getCreatedApps(accountInfo: A_AccountInformation): A_Application[] {
        const createdApps = accountInfo['created-apps'];
        return createdApps;
    }

    getOptedApps(accountInfo: A_AccountInformation): A_AppsLocalState[] {
        const optedApps = accountInfo['apps-local-state'];
        return optedApps;
    }
}