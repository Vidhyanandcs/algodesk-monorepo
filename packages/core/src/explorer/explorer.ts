export class Explorer {
    public url: string

    constructor(url: string) {
        this.url = url;
    }

    getAccountUrl(address: string): string {
        return this.url + '/address/' + address;
    }

    getAssetUrl(assetId: number): string {
        return this.url + '/asset/' + assetId;
    }
}
