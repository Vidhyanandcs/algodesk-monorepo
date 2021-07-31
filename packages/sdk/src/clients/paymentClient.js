import {BaseClient} from "./baseClient";
import * as sdk from "algosdk";
import {encodeText} from "../utils";

export class PaymentClient extends BaseClient{
    constructor(name, signer, wallet) {
        super(name, signer, wallet);
    }

    async preparePaymentTxn(from, to, amount, closeRemainderTo, note, rekeyTo) {
        const networkParams = await this.getNetworkParams();

        amount = sdk.algosToMicroalgos(amount);
        if(note) {
            note = encodeText(note);
        }

        return sdk.makePaymentTxnWithSuggestedParams(from, to, amount, closeRemainderTo, note, networkParams, rekeyTo);
    }

    async payment(from, to, amount, closeRemainderTo, note, rekeyTo) {
        const unsignedTxn = this.preparePaymentTxn(from, to, amount, closeRemainderTo, note, rekeyTo);
        return await this.sendTxn(unsignedTxn);
    }
}