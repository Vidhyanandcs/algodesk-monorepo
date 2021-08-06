import {Algodv2, SuggestedParams, Transaction} from "algosdk";
import {BaseSigner, getSigner} from "../signers";
import SendRawTransaction from "algosdk/dist/types/src/client/v2/algod/sendRawTransaction";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";

export class BaseClient {
    client: Algodv2
    indexer: IndexerClient
    signer: BaseSigner

    constructor(client: Algodv2, indexer: IndexerClient, signer: BaseSigner) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
    }

    async sendTxn(unsignedTxn: Transaction): Promise<SendRawTransaction> {
        const rawSignedTxn: Uint8Array = await this.signer.signTxn(unsignedTxn);
        return await this.client.sendRawTransaction(rawSignedTxn).do();
    }

    async sendGroupTxns(unsignedTxns: Transaction[]): Promise<SendRawTransaction> {
        const rawSignedTxns: Uint8Array[] = await this.signer.signGroupTxns(unsignedTxns);
        return await this.client.sendRawTransaction(rawSignedTxns).do();
    }
}