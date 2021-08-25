import {Algodesk, Explorer, getExplorer, getNetwork, getSigner, Network, NETWORKS, SIGNERS, Signer} from "@algodesk/core";

class AlgoSdk {
    network: Network
    explorer: Explorer
    signer: Signer
    algodesk: Algodesk

    constructor(network: string, signer: string) {
        this.network = getNetwork(network);
        this.explorer = getExplorer(network);
        this.signer = getSigner(signer);
        this.algodesk = new Algodesk(this.network, this.signer);
    }

    changeNetwork(network: string): void {
        this.network = getNetwork(network);
        this.explorer = getExplorer(network);
        this.algodesk = new Algodesk(this.network, this.signer);
    }
}

export default new AlgoSdk(NETWORKS.MAINNET, SIGNERS.ALGO_SIGNER);