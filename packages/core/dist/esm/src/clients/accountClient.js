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
    getHoldingAsset(assetId, accountInfo) {
        const assets = this.getHoldingAssets(accountInfo);
        for (const asset of assets) {
            if (asset['asset-id'] === assetId) {
                return asset;
            }
        }
    }
    getCreatedAsset(assetId, accountInfo) {
        const createdAssets = this.getCreatedAssets(accountInfo);
        for (const asset of createdAssets) {
            if (asset.index === assetId) {
                return asset;
            }
        }
    }
    balanceOf(assetId, accountInfo) {
        const asset = this.getHoldingAsset(assetId, accountInfo);
        if (asset) {
            return asset.amount;
        }
        return 0;
    }
    canManage(address, asset) {
        const manager = asset.params.manager;
        return address === manager;
    }
    canFreeze(address, asset) {
        const freeze = asset.params.freeze;
        return address === freeze;
    }
    canClawback(address, asset) {
        const clawback = asset.params.clawback;
        return address === clawback;
    }
}
//# sourceMappingURL=accountClient.js.map