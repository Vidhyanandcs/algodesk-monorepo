"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountClient = void 0;
const transactionClient_1 = require("./transactionClient");
class AccountClient {
    constructor(client, indexer, signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new transactionClient_1.TransactionClient(client, indexer, signer);
    }
    async getAccountInformation(address) {
        const accountInformation = await this.client.accountInformation(address).do();
        return accountInformation;
    }
    getCreatedAssets(accountInfo) {
        const createdAssets = accountInfo['created-assets'];
        return createdAssets;
    }
    getHoldingAssets(accountInfo) {
        const createdAssets = accountInfo['assets'];
        return createdAssets;
    }
    getCreatedApps(accountInfo) {
        const createdApps = accountInfo['created-apps'];
        return createdApps;
    }
    getOptedApps(accountInfo) {
        const optedApps = accountInfo['apps-local-state'];
        return optedApps;
    }
}
exports.AccountClient = AccountClient;
//# sourceMappingURL=accountClient.js.map