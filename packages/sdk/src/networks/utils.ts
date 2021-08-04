import {TestNet} from "./testNet";
import {BaseNet} from "./baseNet";
import {NETWORKS} from "../constants";
import {BetaNet} from "./betaNet";
import {MainNet} from "./mainNet";

export function getNetwork(name: string): BaseNet{
    if (name == NETWORKS.TESTNET) {
        return new TestNet();
    }
    else if (name == NETWORKS.BETANET) {
        return new BetaNet();
    }

    return new MainNet();
}