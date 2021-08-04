import { getNetwork } from "../networks/utils";
import { getSigner } from "../signers";
export class BaseClient {
    constructor(networkName, signerName) {
        const network = getNetwork(networkName);
        this.setNetwork(network);
        const signer = getSigner(signerName);
        this.setSigner(signer);
    }
    setNetwork(network) {
        this.network = network;
    }
    getNetwork() {
        return this.network;
    }
    getClient() {
        const network = this.getNetwork();
        return network.getClient();
    }
    getIndexer() {
        const network = this.getNetwork();
        return network.getIndexer();
    }
    setSigner(signer) {
        this.signer = signer;
    }
    getSigner() {
        return this.signer;
    }
    async getNetworkParams() {
        const params = await this.getClient().getTransactionParams().do();
        return params;
    }
    async signTxn(unsignedTxn) {
        const signer = this.getSigner();
        const rawSignedTxn = await signer.signTxn(unsignedTxn);
        return rawSignedTxn;
    }
    async sendTxn(unsignedTxn) {
        const rawSignedTxn = await this.signTxn(unsignedTxn);
        return await this.getClient().sendRawTransaction(rawSignedTxn).do();
    }
    async signGroupTxns(unsignedTxns) {
        const signer = this.getSigner();
        const rawSignedTxn = await signer.signGroupTxns(unsignedTxns);
        return rawSignedTxn;
    }
    async sendGroupTxns(unsignedTxns) {
        const rawSignedTxns = await this.signGroupTxns(unsignedTxns);
        return await this.getClient().sendRawTransaction(rawSignedTxns).do();
    }
}
//# sourceMappingURL=baseClient.js.map