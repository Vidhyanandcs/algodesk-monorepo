export class Explorer {
    constructor(url) {
        this.url = url;
    }
    getAccountUrl(address) {
        return this.url + '/address/' + address;
    }
    getAssetUrl(assetId) {
        return this.url + '/asset/' + assetId;
    }
    getTransactionUrl(txId) {
        return this.url + '/tx/' + txId;
    }
}
//# sourceMappingURL=explorer.js.map