import {encodeText} from "../utils";
import sdk, {Algodv2, Transaction} from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import {TransactionClient} from "./transactionClient";
import {A_SendTxnResponse, Signer} from "../types";

export class PaymentClient{
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;

    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }

    async preparePaymentTxn(from: string, to: string, amount: number, note?: string, closeRemainderTo?: string, rekeyTo?: string): Promise<Transaction> {
        const suggestedParams = await this.transactionClient.getSuggestedParams();

        amount = sdk.algosToMicroalgos(amount);
        let encodedNote: Uint8Array | undefined;
        if(note) {
            encodedNote = encodeText(note);
        }

        return sdk.makePaymentTxnWithSuggestedParams(from, to, amount, closeRemainderTo, encodedNote, suggestedParams, rekeyTo);
    }

    async payment(from: string, to: string, amount: number, note?: string, closeRemainderTo?: string, rekeyTo?: string): Promise<A_SendTxnResponse> {
        const unsignedTxn = await this.preparePaymentTxn(from, to, amount, note, closeRemainderTo, rekeyTo);
        return  await this.transactionClient.sendTxn(unsignedTxn);
    }

}