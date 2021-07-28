import {AlgoDesk, getUintProgram, processApplicationArgs} from "@algodesk/sdk";
import {FUND_OPERATIONS} from "./constant";
import * as sdk from "algosdk";
import {getContracts} from "./contracts";
import {LogicSigner} from "@algodesk/sdk/src/signers/logicSigner";

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
        const txn1 = this.algodesk.paymentClient.preparePaymentTxn(address, escrow.address, amount);
        unsignedTransactions.push(txn1);

        /*app call*/
        const appArgs = [FUND_OPERATIONS.INVEST];
        const appArgsUint = processApplicationArgs(appArgs);
        const txn2 = this.algodesk.applicationClient.prepareInvokeTxn(address, fundId, appArgsUint);
        unsignedTransactions.push(txn2);

        const unsignedTransactionsGroup = sdk.assignGroupID(unsignedTransactions);
        return  await this.algodesk.applicationClient.sendGroupTxns(unsignedTransactionsGroup);
    }

    async create(address, appArgs) {
        const globalBytes = 30;
        const globalInts = 30;
        const localBytes = 8;
        const localInts = 8;
        const onComplete = sdk.OnApplicationComplete.NoOpOC;

        const {compiledApprovalProgram, compiledClearProgram} = getContracts();

        const approvalProgram = compiledApprovalProgram.result;
        const clearProgram = compiledClearProgram.result;

        const approvalProgramUint = getUintProgram(approvalProgram);
        const clearProgramUint = getUintProgram(clearProgram);

        appArgs = processApplicationArgs(appArgs);

        return await this.algodesk.applicationClient.create(address, onComplete, approvalProgramUint, clearProgramUint, localInts, localBytes, globalInts, globalBytes, appArgs);
    }

    async compileEscrow(fund) {
        const {asset} = fund;
        const {escrowProgram} = getContracts();
        let {teal} = escrowProgram;
        teal = teal.replaceAll("1111111", asset.index);
        teal = teal.replaceAll("2222222", fund.id);
        return await this.algodesk.applicationClient.compileProgram(teal);
    }

    async deployEscrow(address, fund) {
        const unsignedTransactions = [];
        const {id: fundId, escrow, asset} = fund;

        const compiledEscrow = this.compileEscrow(fund);

        let appArgs = [FUND_OPERATIONS.SET_ESCROW, sdk.decodeAddress(escrow.address).publicKey];
        appArgs = processApplicationArgs(appArgs);

        /*app call*/
        const txn1 = this.algodesk.applicationClient.prepareInvokeTxn(address, fundId, appArgs);
        unsignedTransactions.push(txn1);

        /*payment call*/
        const amount = sdk.algosToMicroalgos(0.5);
        const txn2 = this.algodesk.paymentClient.preparePaymentTxn(address, escrow.address, amount);
        unsignedTransactions.push(txn2);

        /*asset transfer call*/
        const sendAmount = 0;
        const txn3 = this.algodesk.assetClient.prepareTransferTxn(address, escrow.address, undefined, undefined, sendAmount, undefined, asset.index);
        unsignedTransactions.push(txn3);

        const unsignedTransactionsGroup = sdk.assignGroupID(unsignedTransactions);

        const signedRawTxn1 = await this.algodesk.applicationClient.signTxn(unsignedTransactionsGroup[0]);
        const signedRawTxn2 = await this.algodesk.applicationClient.signTxn(unsignedTransactionsGroup[1]);
        const signedRawTxn3 = new LogicSigner().signTxn(compiledEscrow.result, unsignedTransactionsGroup[2])

        return await this.algodesk.applicationClient.send([signedRawTxn1, signedRawTxn2, signedRawTxn3]);
    }
}