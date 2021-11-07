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
import {Fundstack} from "@algodesk/fundstack-sdk";

class FundstackSdk {
    network: Network
    explorer: Explorer
    signer: Signer
    fundstack: Fundstack

    constructor(network: string, signer: string) {
        this.network = getNetwork(network);
        this.explorer = getExplorer(network);
        this.signer = getSigner(signer);
        this.fundstack = new Fundstack(this.network, this.signer);
    }

    changeNetwork(network: string): void {
        this.network = getNetwork(network);
        this.explorer = getExplorer(network);
        this.fundstack = new Fundstack(this.network, this.signer);
    }

    changeSigner(signer: string): void {
        this.signer = getSigner(signer);
        this.fundstack = new Fundstack(this.network, this.signer);
    }
}

export default new FundstackSdk(NETWORKS.BETANET, SIGNERS.MY_ALGO_WALLET);