import {BaseNet} from "../networks/baseNet";
import {getNetwork} from "../networks/utils";
import {Algodv2, Indexer, SuggestedParams, Transaction} from "algosdk";
import {BaseSigner, BrowserAlgoSigner, getSigner, WalletSigner} from "../signers";
import SendRawTransaction from "algosdk/dist/types/src/client/v2/algod/sendRawTransaction";

export class BaseClient {
    network!: BaseNet
    signer!: BaseSigner

    constructor(networkName: string, signerName: string) {
        const network: BaseNet = getNetwork(networkName);
        this.setNetwork(network);

        const signer: BaseSigner = getSigner(signerName);
        this.setSigner(signer);
    }

    setNetwork(network: BaseNet) {
        this.network = network;
    }

    getNetwork(): BaseNet {
        return this.network;
    }

    getClient(): Algodv2 {
        const network: BaseNet = this.getNetwork();
        return network.getClient();
    }

    getIndexer(): Indexer {
        const network: BaseNet = this.getNetwork();
        return network.getIndexer();
    }

    setSigner(signer: BaseSigner) {
        this.signer = signer;
    }

    getSigner(): BaseSigner {
        return this.signer;
    }

    async getNetworkParams(): Promise<SuggestedParams> {
        const params: SuggestedParams = await this.getClient().getTransactionParams().do();
        return params;
    }

    async signTxn(unsignedTxn: Transaction): Promise<Uint8Array> {
        const signer: BaseSigner = this.getSigner();
        const rawSignedTxn: Uint8Array = await signer.signTxn(unsignedTxn);
        return rawSignedTxn;
    }

    async sendTxn(unsignedTxn: Transaction): Promise<SendRawTransaction> {
        const rawSignedTxn: Uint8Array = await this.signTxn(unsignedTxn);
        return await this.getClient().sendRawTransaction(rawSignedTxn).do();
    }

    async signGroupTxns(unsignedTxns: Transaction[]): Promise<Uint8Array[]> {
        const signer: BaseSigner = this.getSigner();
        const rawSignedTxn: Uint8Array[] = await signer.signGroupTxns(unsignedTxns);
        return rawSignedTxn;
    }

    async sendGroupTxns(unsignedTxns: Transaction[]): Promise<SendRawTransaction> {
        const rawSignedTxns: Uint8Array[] = await this.signGroupTxns(unsignedTxns);
        return await this.getClient().sendRawTransaction(rawSignedTxns).do();
    }

}