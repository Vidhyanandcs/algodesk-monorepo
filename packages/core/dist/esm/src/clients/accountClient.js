import { TransactionClient } from "./transactionClient";
export class AccountClient {
    constructor(client, indexer, signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new TransactionClient(client, indexer, signer);
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
//# sourceMappingURL=accountClient.js.map