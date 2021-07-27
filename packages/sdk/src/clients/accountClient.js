import {BaseClient} from "./baseClient";

export class AccountClient extends BaseClient{
    constructor(name) {
        super(name);
    }

    async getAccountInformation(address) {
        return await this.getClient().accountInformation(address).do();
    }
}