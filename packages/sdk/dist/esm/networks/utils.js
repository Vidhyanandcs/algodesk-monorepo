import { TestNet } from "./testNet";
import { NETWORKS } from "../constants";
import { BetaNet } from "./betaNet";
import { MainNet } from "./mainNet";
export function getNetwork(name) {
    if (name == NETWORKS.TESTNET) {
        return new TestNet();
    }
    else if (name == NETWORKS.BETANET) {
        return new BetaNet();
    }
    return new MainNet();
}
//# sourceMappingURL=utils.js.map