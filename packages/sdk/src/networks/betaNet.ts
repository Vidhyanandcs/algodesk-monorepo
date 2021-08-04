import {BaseNet} from "./baseNet";

export class BetaNet extends BaseNet {
    constructor() {
        super('betanet', 'BetaNet', 'https://betanet.algoexplorer.io', 'https://api.betanet.algoexplorer.io', 'https://api.betanet.algoexplorer.io/idx2', 'BetaNet');
    }
}