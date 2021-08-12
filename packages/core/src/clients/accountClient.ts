import {Algodv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {Signer} from "../signers";
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
    }

    async getAccountInformation(address: string): Promise<Record<string, any>> {
        const accountInformation = await this.client.accountInformation(address).do();
        return accountInformation;
    }

    async getCreatedAssets(address: string) {
        const accountInfo = await this.getAccountInformation(address);

        const createdAssets = accountInfo['created-assets'];
        createdAssets.forEach((asset) => {
            asset.id = asset.index;
        });

        return createdAssets;
    }

    async getApplicationTransactions(address: string, appId: number) {
        const {transactions} = await this.indexer.searchForTransactions().applicationID(appId).address(address).do();
        return transactions;
    }
}