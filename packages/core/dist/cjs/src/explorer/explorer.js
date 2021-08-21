"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Explorer = void 0;
class Explorer {
    constructor(url) {
        this.url = url;
    }
    getAccountUrl(address) {
        return this.url + '/address/' + address;
    }
}
exports.Explorer = Explorer;
//# sourceMappingURL=explorer.js.map