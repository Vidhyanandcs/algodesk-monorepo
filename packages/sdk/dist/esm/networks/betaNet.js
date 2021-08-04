import { BaseNet } from "./baseNet";
export class BetaNet extends BaseNet {
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
//# sourceMappingURL=betaNet.js.map