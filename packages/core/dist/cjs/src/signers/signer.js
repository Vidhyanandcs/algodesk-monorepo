"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signer = void 0;
class Signer {
    constructor() {
    }
    async signTxn(unsignedTxn) {
        throw new Error("abstractMethod not implemented");
    }
    async signGroupTxns(unsignedTxns) {
        throw new Error("abstractMethod not implemented");
    }
    setWallet(wallet) {
        throw new Error("abstractMethod not implemented");
    }
}
exports.Signer = Signer;
//# sourceMappingURL=signer.js.map