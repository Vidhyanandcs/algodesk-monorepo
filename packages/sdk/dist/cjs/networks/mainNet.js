"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainNet = void 0;
const baseNet_1 = require("./baseNet");
class MainNet extends baseNet_1.BaseNet {
    constructor() {
        super();
        this.name = 'mainnet';
        this.algod = 'https://api.algoexplorer.io';
        this.label = 'Testnet';
        this.explorer = 'https://algoexplorer.io';
        this.indexer = 'https://api.algoexplorer.io/idx2';
        this.algosigner = 'MainNet';
    }
}
exports.MainNet = MainNet;
//# sourceMappingURL=mainNet.js.map