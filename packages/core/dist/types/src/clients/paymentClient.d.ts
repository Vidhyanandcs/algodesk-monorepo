import { Algodv2, Transaction } from 'algosdk';
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { TransactionClient } from "./transactionClient";
import { A_SendTxnResponse, Signer } from "../types";
export declare class PaymentClient {
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    preparePaymentTxn(from: string, to: string, amount: number, note?: string, closeRemainderTo?: string, rekeyTo?: string): Promise<Transaction>;
    payment(from: string, to: string, amount: number, note?: string, closeRemainderTo?: string, rekeyTo?: string): Promise<A_SendTxnResponse>;
}
