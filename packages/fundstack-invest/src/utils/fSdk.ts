import {
    Explorer,
    getExplorer,
    getNetwork,
    getSigner,
    Network,
    SIGNERS,
    Signer
} from "@algodesk/core";
import {Fundstack} from "@fundstack/sdk";
import {REACT_APP_NETWORK, REACT_APP_PLATFORM_APP_ID} from "../env";

class FSdk {
    network: Network
    explorer: Explorer
    signer: Signer
    fs: Fundstack

    constructor(network: string, signer: string) {
        this.network = getNetwork(network);
        this.explorer = getExplorer(network);
        this.signer = getSigner(signer);
        this.fs = new Fundstack(REACT_APP_PLATFORM_APP_ID, this.network, this.signer);
    }

    changeNetwork(network: string): void {
        this.network = getNetwork(network);
        this.explorer = getExplorer(network);
        this.fs = new Fundstack(REACT_APP_PLATFORM_APP_ID, this.network, this.signer);
    }

    changeSigner(signer: string): void {
        this.signer = getSigner(signer);
        this.fs = new Fundstack(REACT_APP_PLATFORM_APP_ID, this.network, this.signer);
    }
}

export default new FSdk(REACT_APP_NETWORK, SIGNERS.MY_ALGO_WALLET);