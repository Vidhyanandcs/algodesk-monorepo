import {BaseClient} from "./baseClient";
import {Algodv2} from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {Signer} from "../signers";

export class AccountClient extends BaseClient{
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        super(client, indexer, signer);
    }

    async getAccountInformation(address): Promise<any> {
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