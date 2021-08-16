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
    async getCreatedAssets(accountInfo) {
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }
        const createdAssets = accountInfo['created-assets'];
        return createdAssets;
    }
    async getHoldingAssets(accountInfo) {
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }
        const createdAssets = accountInfo['assets'];
        return createdAssets;
    }
    async getCreatedApps(accountInfo) {
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }
        const createdApps = accountInfo['created-apps'];
        return createdApps;
    }
    async getOptedApps(accountInfo) {
        if (typeof accountInfo === 'string') {
            const address = accountInfo;
            accountInfo = await this.getAccountInformation(address);
        }
        const optedApps = accountInfo['apps-local-state'];
        return optedApps;
    }
}
exports.AccountClient = AccountClient;
//# sourceMappingURL=accountClient.js.map