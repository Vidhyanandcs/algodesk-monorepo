import { BaseNet } from "./baseNet";
export class TestNet extends BaseNet {
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
//# sourceMappingURL=testNet.js.map