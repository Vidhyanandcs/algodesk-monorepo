"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestNet = void 0;
const baseNet_1 = require("./baseNet");
class TestNet extends baseNet_1.BaseNet {
    constructor() {
        super();
        this.name = 'testnet';
        this.algod = 'https://api.testnet.algoexplorer.io';
        this.label = 'Testnet';
        this.explorer = 'https://testnet.algoexplorer.io';
        this.indexer = 'https://api.testnet.algoexplorer.io/idx2';
        this.algosigner = 'TestNet';
    }
}
exports.TestNet = TestNet;
//# sourceMappingURL=testNet.js.map