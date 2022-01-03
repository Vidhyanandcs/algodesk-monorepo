import {
    Explorer,
    getExplorer,
    getNetwork,
    getSigner,
    Network,
    NETWORKS,
    SIGNERS,
    Signer
} from "@algodesk/core";
import {Fundstack} from "@fundstack/sdk";
import {REACT_APP_PLATFORM_APP_ID} from "../env";

class FundstackSdk {
    network: Network
    explorer: Explorer
    signer: Signer
    fundstack: Fundstack

    constructor(network: string, signer: string) {
        this.network = getNetwork(network);
        this.explorer = getExplorer(network);
        this.signer = getSigner(signer);
        this.fundstack = new Fundstack(REACT_APP_PLATFORM_APP_ID, this.network, this.signer);
    }

    changeNetwork(network: string): void {
        this.network = getNetwork(network);
        this.explorer = getExplorer(network);
        this.fundstack = new Fundstack(REACT_APP_PLATFORM_APP_ID, this.network, this.signer);
    }

    changeSigner(signer: string): void {
        this.signer = getSigner(signer);
        this.fundstack = new Fundstack(REACT_APP_PLATFORM_APP_ID, this.network, this.signer);
    }
}

export default new FundstackSdk(NETWORKS.BETANET, SIGNERS.MY_ALGO_WALLET);