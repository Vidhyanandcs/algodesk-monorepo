import {Network} from "./network";
import {LOCAL_STORAGE, NETWORKS} from "../constants";

export const testnet = new Network(NETWORKS.TESTNET, 'TestNet', 'https://testnet-api.algonode.cloud', 'https://testnet-idx.algonode.cloud');
export const betanet = new Network(NETWORKS.BETANET, 'BetaNet', 'https://api.betanet.algoexplorer.io', 'https://api.betanet.algoexplorer.io/idx2');
export const mainnet = new Network(NETWORKS.MAINNET, 'MainNet', 'https://mainnet-api.algonode.cloud', 'https://mainnet-idx.algonode.cloud');

export function getNetwork(name: string): Network{
    if (name == NETWORKS.TESTNET) {
        return testnet;
    }
    else if (name == NETWORKS.BETANET) {
        return betanet;
    }

    return mainnet;
}

export function getNetworks(): Network[] {
    return [testnet, betanet, mainnet];
}

export function getLocalNetwork(): string {
    return localStorage.getItem(LOCAL_STORAGE.NETWORK);
}

export function setLocalNetwork(name: string): void {
    localStorage.setItem(LOCAL_STORAGE.NETWORK, name);
}