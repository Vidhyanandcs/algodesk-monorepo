import { BaseNet } from "./baseNet";
export class MainNet extends BaseNet {
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
//# sourceMappingURL=mainNet.js.map