export class Explorer {
    constructor(url) {
        this.url = url;
    }
    getAccountUrl(address) {
        return this.url + '/address/' + address;
    }
}
//# sourceMappingURL=explorer.js.map