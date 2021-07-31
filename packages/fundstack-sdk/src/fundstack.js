import {getDurationBetweenBlocks, getUintProgram, processApplicationArgs, AlgoDesk, LogicSigner} from "@algodesk/sdk";
import {FUND_OPERATIONS, FUND_PHASE} from "./constant";
import * as sdk from "algosdk";
import {getFundState, getGlobalState} from "./utils";
import {globalStateKeys} from "./state";
import atob from 'atob';
import {getContracts} from "./contracts";

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

        const compiledEscrow = await this.compileEscrow(fund);

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

    async get(fundId) {
        let fund = await this.algodesk.applicationClient.get(fundId);
        fund.globalState = getGlobalState(fund);
        fund.published = getFundState(fund) >= 3;

        const companyDetailsTxId = fund.globalState[globalStateKeys.company_details];
        const assetId = fund.globalState[globalStateKeys.asset_id];
        const escrowAddress = fund.globalState[globalStateKeys.escrow];

        const [status, company, asset, escrow] = await Promise.all([this.getStatus(fund.globalState), this.getCompany(companyDetailsTxId), this.getAsset(assetId), this.getEscrow(escrowAddress)]);

        fund = {
            ...fund,
            status,
            company,
            asset,
            escrow
        }

        return fund;
    }

    async getEscrow(address) {
        const escrowAccount = await this.algodesk.accountClient.getAccountInformation(address);
        escrowAccount.balance = sdk.microalgosToAlgos(escrowAccount.amount);
        return escrowAccount;
    }

    async getAsset(assetId) {
        return await this.algodesk.assetClient.get(assetId);
    }

    async getCompany(companyDetailsTxId) {
        const tx = await this.algodesk.applicationClient.getTransaction(companyDetailsTxId);
        const {note} = tx;
        return  JSON.parse(atob(note));
    }

    async getStatus(globalState) {
        const networkParams = await this.algodesk.applicationClient.getNetworkParams();
        const currentRound = networkParams.firstRound;

        const regStart = globalState[globalStateKeys.reg_starts_at];
        const regEnd = globalState[globalStateKeys.reg_ends_at];

        const saleStart = globalState[globalStateKeys.sale_starts_at];
        const saleEnd = globalState[globalStateKeys.sale_ends_at];

        const claimStart = globalState[globalStateKeys.claim_after];
        const claimEnd = claimStart + 76800;//add 4 days

        let phase = 0;

        if (currentRound < regStart) {
            phase = FUND_PHASE.BEFORE_REGISTRATION;
        }
        else if(currentRound >= regStart && currentRound <= regEnd) {
            phase = FUND_PHASE.DURING_REGISTRATION;
        }
        else if(currentRound > regEnd && currentRound < saleStart) {
            phase = FUND_PHASE.BEFORE_SALE;
        }
        else if(currentRound >= saleStart && currentRound <= saleEnd) {
            phase = FUND_PHASE.DURING_SALE;
        }
        else if(currentRound > saleEnd && currentRound < claimStart) {
            phase = FUND_PHASE.BEFORE_CLAIM;
        }
        else if(currentRound >= claimStart && currentRound <= claimEnd) {
            phase = FUND_PHASE.DURING_CLAIM;
        }
        else if(currentRound > claimEnd) {
            phase = FUND_PHASE.COMPLETED;
        }

        const registration = {
            start: getDurationBetweenBlocks(regStart, currentRound),
            end: getDurationBetweenBlocks(regEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_REGISTRATION,
            active: phase == FUND_PHASE.DURING_REGISTRATION,
            completed: phase > FUND_PHASE.DURING_REGISTRATION
        };

        const sale = {
            start: getDurationBetweenBlocks(saleStart, currentRound),
            end: getDurationBetweenBlocks(saleEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_SALE,
            active: phase == FUND_PHASE.DURING_SALE,
            completed: phase > FUND_PHASE.DURING_SALE
        };

        const claim = {
            start: getDurationBetweenBlocks(claimStart, currentRound),
            end: getDurationBetweenBlocks(claimEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_CLAIM,
            active: phase == FUND_PHASE.DURING_CLAIM,
            completed: phase > FUND_PHASE.DURING_CLAIM
        };

        const status = {
            registration,
            sale,
            phase,
            claim,
            date: Date.now()
        }

        return status;
    }
}