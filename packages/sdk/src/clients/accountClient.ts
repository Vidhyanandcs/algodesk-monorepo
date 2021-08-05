import {BaseClient} from "./baseClient";
import AccountInformation from "algosdk/dist/types/src/client/v2/algod/accountInformation";

export class AccountClient extends BaseClient{
    constructor(name: string, signerName: string) {
        super(name, signerName);
    }

    async getAccountInformation(address): Promise<Record<string, any>> {
        const accountInformation: Record<string, any> = await this.getClient().accountInformation(address).do();
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
}