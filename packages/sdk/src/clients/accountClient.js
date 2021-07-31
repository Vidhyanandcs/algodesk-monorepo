import {BaseClient} from "./baseClient";

export class AccountClient extends BaseClient{
    constructor(name) {
        super(name);
    }

    async getAccountInformation(address) {
        return await this.getClient().accountInformation(address).do();
    }

    async getCreatedAssets(address) {
        const accountInfo = await this.getAccountInformation(address);

        const createdAssets = accountInfo['created-assets'];
        createdAssets.forEach((asset) => {
            asset.id = asset.index;
        });

        return createdAssets;
    }
}