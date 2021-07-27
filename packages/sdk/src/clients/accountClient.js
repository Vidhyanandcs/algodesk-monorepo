import BaseClient from "./baseClient";
import * as sdk from "algosdk";

class AccountClient extends BaseClient{
    constructor(name) {
        super(name);
    }

    async getAccountInformation(address) {
        return await this.getClient().accountInformation(address).do();
    }
}

export default AccountClient;