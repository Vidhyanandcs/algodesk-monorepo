import {
    A_CreateApplicationParams,
    Algodesk,
    durationBetweenBlocks,
    getUintProgram,
    Network,
    Signer,
    A_SendTxnResponse,
    numToUint
} from "@algodesk/core";
import {getFundState, getGlobalState} from "./utils";
import {globalStateKeys} from "./state";
import {FUND_PHASE} from "./constants";
import atob from 'atob';
import {getContracts} from "./contracts";
import {OnApplicationComplete} from "algosdk";
import {F_DeployFund} from "./types";


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
            address: params.address,
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

    async get(fundId: number) {
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

    async getEscrow(address: string) {
        const escrowAccount = await this.algodesk.accountClient.getAccountInformation(address);
        return escrowAccount;
    }

    async getAsset(assetId: number) {
        return await this.algodesk.assetClient.get(assetId);
    }

    async getCompany(companyDetailsTxId: string) {
        const tx = await this.algodesk.transactionClient.get(companyDetailsTxId);
        const {note} = tx;
        if (note) {
            return  JSON.parse(atob(note));
        }
        return {};
    }

    async getStatus(globalState) {
        const suggestedParams = await this.algodesk.transactionClient.getSuggestedParams();
        const currentRound = suggestedParams.firstRound;

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
            start: durationBetweenBlocks(regStart, currentRound),
            end: durationBetweenBlocks(regEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_REGISTRATION,
            active: phase == FUND_PHASE.DURING_REGISTRATION,
            completed: phase > FUND_PHASE.DURING_REGISTRATION
        };

        const sale = {
            start: durationBetweenBlocks(saleStart, currentRound),
            end: durationBetweenBlocks(saleEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_SALE,
            active: phase == FUND_PHASE.DURING_SALE,
            completed: phase > FUND_PHASE.DURING_SALE
        };

        const claim = {
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
}