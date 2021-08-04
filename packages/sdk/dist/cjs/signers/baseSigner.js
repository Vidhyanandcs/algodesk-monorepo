"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSigner = void 0;
class BaseSigner {
    constructor() {
    }
    async signTxn(unsignedTxn) {
        throw new Error("abstractMethod not implemented");
    }
    async signGroupTxns(unsignedTxns) {
        throw new Error("abstractMethod not implemented");
    }
}
exports.BaseSigner = BaseSigner;
//# sourceMappingURL=baseSigner.js.map