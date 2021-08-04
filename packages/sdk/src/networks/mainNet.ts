import {BaseNet} from "./baseNet";

export class MainNet extends BaseNet {
    constructor() {
        super('mainnet', 'MainNet', 'https://algoexplorer.io', 'https://api.algoexplorer.io', 'https://api.algoexplorer.io/idx2', 'MainNet');
    }
}