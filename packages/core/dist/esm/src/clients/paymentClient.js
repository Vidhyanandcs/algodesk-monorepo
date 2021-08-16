import { encodeText } from "../utils";
import sdk from 'algosdk';
import { TransactionClient } from "./transactionClient";
export class PaymentClient {
    constructor(client, indexer, signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new TransactionClient(client, indexer, signer);
    }
    async preparePaymentTxn(from, to, amount, note, closeRemainderTo, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        amount = sdk.algosToMicroalgos(amount);
        let encodedNote;
        if (note) {
            encodedNote = encodeText(note);
        }
        return sdk.makePaymentTxnWithSuggestedParams(from, to, amount, closeRemainderTo, encodedNote, suggestedParams, rekeyTo);
    }
    async payment(from, to, amount, note, closeRemainderTo, rekeyTo) {
        const unsignedTxn = await this.preparePaymentTxn(from, to, amount, note, closeRemainderTo, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
}
//# sourceMappingURL=paymentClient.js.map