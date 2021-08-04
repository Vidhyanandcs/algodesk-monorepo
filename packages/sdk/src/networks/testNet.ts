import {BaseNet} from "./baseNet";

export class TestNet extends BaseNet {
    constructor() {
        super('testnet', 'TestNet', 'https://testnet.algoexplorer.io', 'https://api.testnet.algoexplorer.io', 'https://api.testnet.algoexplorer.io/idx2', 'TestNet');
    }
}