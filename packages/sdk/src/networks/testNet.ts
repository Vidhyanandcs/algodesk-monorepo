import {BaseNet} from "./baseNet";

export class TestNet extends BaseNet {
    name: string = 'testnet'
    algod: string = 'https://api.testnet.algoexplorer.io'
    label: string = 'Testnet'
    explorer: string = 'https://testnet.algoexplorer.io'
    indexer: string = 'https://api.testnet.algoexplorer.io/idx2'
    algosigner: string = 'TestNet'

    constructor() {
        super();
    }
}