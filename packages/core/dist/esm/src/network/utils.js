import { Network } from "./network";
import { NETWORKS } from "../constants";
export const testnet = new Network(NETWORKS.TESTNET, 'TestNet', 'https://api.testnet.algoexplorer.io', 'https://api.testnet.algoexplorer.io/idx2');
export const betanet = new Network(NETWORKS.BETANET, 'BetaNet', 'https://api.betanet.algoexplorer.io', 'https://api.betanet.algoexplorer.io/idx2');
export const mainnet = new Network(NETWORKS.MAINNET, 'MainNet', 'https://api.algoexplorer.io', 'https://api.algoexplorer.io/idx2');
export function getNetwork(name) {
    if (name == NETWORKS.TESTNET) {
        return testnet;
    }
    else if (name == NETWORKS.BETANET) {
        return betanet;
    }
    return mainnet;
}
export function getNetworks() {
    return [testnet, betanet, mainnet];
}
//# sourceMappingURL=utils.js.map