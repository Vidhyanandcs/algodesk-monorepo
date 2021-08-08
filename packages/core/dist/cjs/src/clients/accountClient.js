"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountClient = void 0;
const baseClient_1 = require("./baseClient");
class AccountClient extends baseClient_1.BaseClient {
    constructor(client, indexer, signer) {
        super(client, indexer, signer);
    }
    async getAccountInformation(address) {
        const accountInformation = await this.client.accountInformation(address).do();
        return accountInformation;
    }
    async getCreatedAssets(address) {
        const accountInfo = await this.getAccountInformation(address);
        const createdAssets = accountInfo['created-assets'];
        createdAssets.forEach((asset) => {
            asset.id = asset.index;
        });
        return createdAssets;
    }
    async getApplicationTransactions(address, appId) {
        const { transactions } = await this.indexer.searchForTransactions().applicationID(appId).address(address).do();
        return transactions;
    }
}
exports.AccountClient = AccountClient;
//# sourceMappingURL=accountClient.js.map