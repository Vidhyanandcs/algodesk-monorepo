import {BaseNet} from "./baseNet";

export class MainNet extends BaseNet {
    name: string = 'mainnet'
    algod: string = 'https://api.algoexplorer.io'
    label: string = 'Testnet'
    explorer: string = 'https://algoexplorer.io'
    indexer: string = 'https://api.algoexplorer.io/idx2'
    algosigner: string = 'MainNet'

    constructor() {
        super();
    }
}