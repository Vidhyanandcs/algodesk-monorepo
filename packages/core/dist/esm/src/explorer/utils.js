import { Explorer } from "./explorer";
import { NETWORKS } from "../constants";
export const testnetExplorer = new Explorer("https://testnet.algoexplorer.io");
export const betanetExplorer = new Explorer("https://betanet.algoexplorer.io");
export const mainnetExplorer = new Explorer("https://algoexplorer.io");
export function getExplorer(name) {
    if (name == NETWORKS.TESTNET) {
        return testnetExplorer;
    }
    else if (name == NETWORKS.BETANET) {
        return betanetExplorer;
    }
    return mainnetExplorer;
}
export function getExplorers() {
    return [testnetExplorer, betanetExplorer, mainnetExplorer];
}
//# sourceMappingURL=utils.js.map