"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetaNet = void 0;
const baseNet_1 = require("./baseNet");
class BetaNet extends baseNet_1.BaseNet {
    constructor() {
        super();
        this.name = 'betanet';
        this.algod = 'https://api.betanet.algoexplorer.io';
        this.label = 'Testnet';
        this.explorer = 'https://betanet.algoexplorer.io';
        this.indexer = 'https://api.betanet.algoexplorer.io/idx2';
        this.algosigner = 'BetaNet';
    }
}
exports.BetaNet = BetaNet;
//# sourceMappingURL=betaNet.js.map