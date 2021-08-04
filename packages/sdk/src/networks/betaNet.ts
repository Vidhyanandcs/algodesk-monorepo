import {BaseNet} from "./baseNet";

export class BetaNet extends BaseNet {
    name: string = 'betanet'
    algod: string = 'https://api.betanet.algoexplorer.io'
    label: string = 'Testnet'
    explorer: string = 'https://betanet.algoexplorer.io'
    indexer: string = 'https://api.betanet.algoexplorer.io/idx2'
    algosigner: string = 'BetaNet'

    constructor() {
        super();
    }
}