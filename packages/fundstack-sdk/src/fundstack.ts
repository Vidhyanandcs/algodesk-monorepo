import {Algodesk, durationBetweenBlocks, Network, Signer} from "@algodesk/core";
import {getFundState, getGlobalState} from "./utils";
import {globalStateKeys} from "./state";
import sdk from "algosdk";
import {FUND_PHASE} from "./constants";
import atob from 'atob';
import {getContracts} from "./contracts";
import replaceAll from 'replaceall';

export class Fundstack {
    private algodesk: Algodesk;
    constructor(network: Network, signer: Signer) {
        this.algodesk = new Algodesk(network, signer);
    }

    async compileEscrow(fund) {
        const {asset} = fund;
        const {escrowProgram} = getContracts();
        let {teal} = escrowProgram;
        teal = replaceAll("1111111", asset.index + "", teal);
        teal = replaceAll("2222222", fund.id + "", teal);
        return await this.algodesk.applicationClient.compileProgram(teal);
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
        escrowAccount.balance = sdk.microalgosToAlgos(escrowAccount.amount);
        return escrowAccount;
    }

    async getAsset(assetId: number) {
        return await this.algodesk.assetClient.get(assetId);
    }

    async getCompany(companyDetailsTxId: string) {
        const tx = await this.algodesk.transactionClient.get(companyDetailsTxId);
        const {note} = tx;
        return  JSON.parse(atob(note));
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