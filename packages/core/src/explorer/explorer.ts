export class Explorer {
    public url: string

    constructor(url: string) {
        this.url = url;
    }

    getAccountUrl(address: string): string {
        return this.url + '/address/' + address;
    }

    getAssetUrl(assetId: number | bigint): string {
        return this.url + '/asset/' + assetId;
    }

    getTransactionUrl(txId: string): string {
        return this.url + '/tx/' + txId;
    }

    getApplicationUrl(appId: number | bigint): string {
        return this.url + '/application/' + appId;
    }

    openAsset(assetId: number | bigint): void {
        if (assetId) {
            const url = this.getAssetUrl(assetId);
            window.open(url, "_blank");
        }
    }

    openAccount(address: string = ""): void {
        if (address) {
            const url = this.getAccountUrl(address);
            window.open(url, "_blank");
        }
    }

    openTransaction(txId: string): void {
        if (txId) {
            const url = this.getTransactionUrl(txId);
            window.open(url, "_blank");
        }
    }

    openApplication(appId: number | bigint): void {
        if (appId) {
            const url = this.getApplicationUrl(appId);
            window.open(url, "_blank");
        }
    }
}
