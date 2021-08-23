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
}
//# sourceMappingURL=explorer.js.map