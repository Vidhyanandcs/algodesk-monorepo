export class BaseSigner {
    constructor() {
    }
    async signTxn(unsignedTxn) {
        throw new Error("abstractMethod not implemented");
    }
    async signGroupTxns(unsignedTxns) {
        throw new Error("abstractMethod not implemented");
    }
}
//# sourceMappingURL=baseSigner.js.map