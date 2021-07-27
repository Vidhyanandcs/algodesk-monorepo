import {AlgoDesk, processApplicationArgs} from "@algodesk/sdk";
import {FUND_OPERATIONS} from "./constant";
import * as sdk from "algosdk";

export class FundStack {
    constructor(name, signer, wallet) {
        this.algodesk = new AlgoDesk(name, signer, wallet);
    }

    async register(address, fund) {
        return  await this.algodesk.applicationClient.optIn(address, fund.id);
    }

    async invest(address, fund, amount) {
        const unsignedTransactions = [];
        const {id: fundId, escrow} = fund;

        /*payment call*/
        const txn1 = this.algodesk.paymentClient.preparePaymentTxn(address, escrow, amount);
        unsignedTransactions.push(txn1);

        /*app call*/
        const appArgs = [FUND_OPERATIONS.INVEST];
        const appArgsUint = processApplicationArgs(appArgs);
        const txn2 = this.algodesk.applicationClient.prepareInvokeTxn(address, fundId, appArgsUint);
        unsignedTransactions.push(txn2);

        const unsignedTransactionsGroup = sdk.assignGroupID(unsignedTransactions);
        return  await this.algodesk.applicationClient.sendGroupTxns(unsignedTransactionsGroup);
    }
}