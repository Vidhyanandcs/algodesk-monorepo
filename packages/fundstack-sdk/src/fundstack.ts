import {
    A_CreateApplicationParams,
    Algodesk,
    getUintProgram,
    Network,
    Signer,
    A_SendTxnResponse,
    numToUint,
    A_InvokeApplicationParams,
    A_TransferAssetParams,
    A_AccountInformation,
    A_Asset,
    durationBetweenBlocks,
    A_OptInApplicationParams, A_DeleteApplicationParams
} from "@algodesk/core";
import {ESCROW_MIN_TOP_UP, FUND_OPERATIONS, FUND_PHASE} from "./constants";
import {getContracts} from "./contracts";
import {assignGroupID, OnApplicationComplete} from "algosdk";
import {F_DeployFund, F_FundStatus, F_PhaseDetails} from "./types";
import {Fund} from "./fund";

export class Fundstack {
    algodesk: Algodesk;
    constructor(network: Network, signer: Signer) {
        this.algodesk = new Algodesk(network, signer);
    }

    async deploy(params: F_DeployFund): Promise<A_SendTxnResponse> {
        const {compiledApprovalProgram, compiledClearProgram} = getContracts();

        const ints: number[] = [params.assetId, params.regStartsAt, params.regEndsAt, params.saleStartsAt, params.saleEndsAt, params.totalAllocation, params.minAllocation, params.maxAllocation, params.swapRatio];
        const intsUint = [];
        ints.forEach((item) => {
            intsUint.push(numToUint(parseInt(String(item))));
        });

        const appArgs = [params.name, ...intsUint];

        const fundParams: A_CreateApplicationParams = {
            from: params.from,
            approvalProgram: getUintProgram(compiledApprovalProgram.result),
            clearProgram: getUintProgram(compiledClearProgram.result),
            globalBytes: 30,
            globalInts: 30,
            localBytes: 7,
            localInts: 7,
            onComplete: OnApplicationComplete.NoOpOC,
            appArgs
        };

        return await this.algodesk.applicationClient.create(fundParams);
    }

    async fundEscrow(fundId: number) {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const creator = fund.getCreator();
        const escrow = fund.getEscrow();
        const assetId = fund.getAssetId();
        const totalAllocation = fund.getTotalAllocation();

        const paymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(creator, escrow, ESCROW_MIN_TOP_UP);

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: creator,
            foreignAssets: [assetId],
            appArgs: [FUND_OPERATIONS.FUND_ESCROW]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        const params: A_TransferAssetParams = {
            from: creator,
            to: escrow,
            assetId,
            amount: totalAllocation
        };
        const assetXferTxn = await this.algodesk.assetClient.prepareTransferTxn(params);
        const txnGroup = assignGroupID([paymentTxn, appCallTxn, assetXferTxn]);

        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async register(fundId: number, address: string) {
        const params: A_OptInApplicationParams = {
            appId: fundId,
            from: address
        };

        const optInTxn = await this.algodesk.applicationClient.optIn(params);
        return optInTxn;
    }

    async invest(fundId: number, address: string) {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const escrow = fund.getEscrow();

        const paymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(address, escrow, ESCROW_MIN_TOP_UP);

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: address,
            appArgs: [FUND_OPERATIONS.INVEST]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);


        const txnGroup = assignGroupID([paymentTxn, appCallTxn]);

        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async investorClaim(fundId: number, address: string) {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const assetId = fund.getAssetId();

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: address,
            foreignAssets: [assetId],
            appArgs: [FUND_OPERATIONS.INVESTOR_CLAIM]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        return appCallTxn;
    }

    async investorWithdraw(fundId: number, address: string) {
        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: address,
            appArgs: [FUND_OPERATIONS.INVESTOR_WITHDRAW]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        return appCallTxn;
    }

    async ownerClaim(fundId: number, burn: boolean) {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);


        const assetId = fund.getAssetId();
        const creator = fund.getCreator();
        const burnUint = burn ? numToUint(1): numToUint(0);

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: creator,
            foreignAssets: [assetId],
            appArgs: [FUND_OPERATIONS.OWNER_CLAIM, burnUint]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        return appCallTxn;
    }

    async ownerWithdraw(fundId: number) {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const assetId = fund.getAssetId();
        const creator = fund.getCreator();

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: creator,
            foreignAssets: [assetId],
            appArgs: [FUND_OPERATIONS.OWNER_WITHDRAW]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        return appCallTxn;
    }

    async get(fundId: number): Promise<Fund> {
        let fundApp = await this.algodesk.applicationClient.get(fundId);

        const fund = new Fund(fundApp);

        const assetId = fund.getAssetId();
        const escrowAddress = fund.getEscrow();

        const [status, asset, escrow] = await Promise.all([this.getStatus(fund), this.getAsset(assetId), this.getEscrow(escrowAddress)]);

        fund.updateStatusDetails(status);
        fund.updateAssetDetails(asset);
        fund.updateEscrowDetails(escrow);

        return fund;
    }

    async getStatus(fund: Fund): Promise<F_FundStatus> {
        const suggestedParams = await this.algodesk.transactionClient.getSuggestedParams();
        const currentRound = suggestedParams.firstRound;

        const regStart = fund.getRegStart();
        const regEnd = fund.getRegEnd();

        const saleStart = fund.getSaleStart();
        const saleEnd = fund.getSaleEnd();

        const claimStart = fund.getClaimStart();
        const claimEnd = fund.getClaimEnd();

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

        const registration: F_PhaseDetails = {
            start: durationBetweenBlocks(regStart, currentRound),
            end: durationBetweenBlocks(regEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_REGISTRATION,
            active: phase == FUND_PHASE.DURING_REGISTRATION,
            completed: phase > FUND_PHASE.DURING_REGISTRATION
        };

        const sale: F_PhaseDetails = {
            start: durationBetweenBlocks(saleStart, currentRound),
            end: durationBetweenBlocks(saleEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_SALE,
            active: phase == FUND_PHASE.DURING_SALE,
            completed: phase > FUND_PHASE.DURING_SALE
        };

        const claim: F_PhaseDetails = {
            start: durationBetweenBlocks(claimStart, currentRound),
            end: durationBetweenBlocks(claimEnd, currentRound),
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

    async getEscrow(address: string): Promise<A_AccountInformation> {
        const escrow = await this.algodesk.accountClient.getAccountInformation(address);
        return escrow;
    }

    async getAsset(assetId: number): Promise<A_Asset> {
        const asset = await this.algodesk.assetClient.get(assetId);
        return asset;
    }

    async delete(fundId: number, address: string) {
        const params: A_DeleteApplicationParams = {
            appId: fundId,
            from: address
        };

        const deleteTxn = await this.algodesk.applicationClient.delete(params);
        return deleteTxn;
    }
}