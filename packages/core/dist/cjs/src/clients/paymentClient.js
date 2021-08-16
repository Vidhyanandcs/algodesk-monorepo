"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentClient = void 0;
const utils_1 = require("../utils");
const algosdk_1 = __importDefault(require("algosdk"));
const transactionClient_1 = require("./transactionClient");
class PaymentClient {
    constructor(client, indexer, signer) {
        this.client = client;
        this.indexer = indexer;
        this.signer = signer;
        this.transactionClient = new transactionClient_1.TransactionClient(client, indexer, signer);
    }
    async preparePaymentTxn(from, to, amount, note, closeRemainderTo, rekeyTo) {
        const suggestedParams = await this.transactionClient.getSuggestedParams();
        amount = algosdk_1.default.algosToMicroalgos(amount);
        let encodedNote;
        if (note) {
            encodedNote = utils_1.encodeText(note);
        }
        return algosdk_1.default.makePaymentTxnWithSuggestedParams(from, to, amount, closeRemainderTo, encodedNote, suggestedParams, rekeyTo);
    }
    async payment(from, to, amount, note, closeRemainderTo, rekeyTo) {
        const unsignedTxn = await this.preparePaymentTxn(from, to, amount, note, closeRemainderTo, rekeyTo);
        return await this.transactionClient.sendTxn(unsignedTxn);
    }
}
exports.PaymentClient = PaymentClient;
//# sourceMappingURL=paymentClient.js.map