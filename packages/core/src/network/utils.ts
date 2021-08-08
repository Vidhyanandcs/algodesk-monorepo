import {Network} from "./network";
import {NETWORKS} from "../constants";

export const testnet = new Network('testnet', 'TestNet', 'https://testnet.algoexplorer.io', 'https://api.testnet.algoexplorer.io', 'https://api.testnet.algoexplorer.io/idx2');
export const betanet = new Network('betanet', 'BetaNet', 'https://betanet.algoexplorer.io', 'https://api.betanet.algoexplorer.io', 'https://api.betanet.algoexplorer.io/idx2');
export const mainnet = new Network('mainnet', 'MainNet', 'https://algoexplorer.io', 'https://api.algoexplorer.io', 'https://api.algoexplorer.io/idx2');

export function getNetwork(name: string): Network{
    if (name == NETWORKS.TESTNET) {
        return testnet;
    }
    else if (name == NETWORKS.BETANET) {
        return betanet;
    }

    return mainnet;
}