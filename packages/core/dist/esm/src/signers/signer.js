export class Signer {
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
//# sourceMappingURL=signer.js.map