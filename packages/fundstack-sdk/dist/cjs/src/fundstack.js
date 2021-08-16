"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fundstack = void 0;
const core_1 = require("@algodesk/core");
const utils_1 = require("./utils");
const state_1 = require("./state");
const constants_1 = require("./constants");
const atob_1 = __importDefault(require("atob"));
const contracts_1 = require("./contracts");
const replaceall_1 = __importDefault(require("replaceall"));
class Fundstack {
    constructor(network, signer) {
        this.algodesk = new core_1.Algodesk(network, signer);
    }
    async compileEscrow(fund) {
        const { asset } = fund;
        const { escrowProgram } = contracts_1.getContracts();
        let { teal } = escrowProgram;
        teal = replaceall_1.default("1111111", asset.index + "", teal);
        teal = replaceall_1.default("2222222", fund.id + "", teal);
        return await this.algodesk.applicationClient.compileProgram(teal);
    }
    async get(fundId) {
        let fund = await this.algodesk.applicationClient.get(fundId);
        fund.globalState = utils_1.getGlobalState(fund);
        fund.published = utils_1.getFundState(fund) >= 3;
        const companyDetailsTxId = fund.globalState[state_1.globalStateKeys.company_details];
        const assetId = fund.globalState[state_1.globalStateKeys.asset_id];
        const escrowAddress = fund.globalState[state_1.globalStateKeys.escrow];
        const [status, company, asset, escrow] = await Promise.all([this.getStatus(fund.globalState), this.getCompany(companyDetailsTxId), this.getAsset(assetId), this.getEscrow(escrowAddress)]);
        fund = {
            ...fund,
            status,
            company,
            asset,
            escrow
        };
        return fund;
    }
    async getEscrow(address) {
        const escrowAccount = await this.algodesk.accountClient.getAccountInformation(address);
        return escrowAccount;
    }
    async getAsset(assetId) {
        return await this.algodesk.assetClient.get(assetId);
    }
    async getCompany(companyDetailsTxId) {
        const tx = await this.algodesk.transactionClient.get(companyDetailsTxId);
        const { note } = tx;
        return JSON.parse(atob_1.default(note));
    }
    async getStatus(globalState) {
        const suggestedParams = await this.algodesk.transactionClient.getSuggestedParams();
        const currentRound = suggestedParams.firstRound;
        const regStart = globalState[state_1.globalStateKeys.reg_starts_at];
        const regEnd = globalState[state_1.globalStateKeys.reg_ends_at];
        const saleStart = globalState[state_1.globalStateKeys.sale_starts_at];
        const saleEnd = globalState[state_1.globalStateKeys.sale_ends_at];
        const claimStart = globalState[state_1.globalStateKeys.claim_after];
        const claimEnd = claimStart + 76800; //add 4 days
        let phase = 0;
        if (currentRound < regStart) {
            phase = constants_1.FUND_PHASE.BEFORE_REGISTRATION;
        }
        else if (currentRound >= regStart && currentRound <= regEnd) {
            phase = constants_1.FUND_PHASE.DURING_REGISTRATION;
        }
        else if (currentRound > regEnd && currentRound < saleStart) {
            phase = constants_1.FUND_PHASE.BEFORE_SALE;
        }
        else if (currentRound >= saleStart && currentRound <= saleEnd) {
            phase = constants_1.FUND_PHASE.DURING_SALE;
        }
        else if (currentRound > saleEnd && currentRound < claimStart) {
            phase = constants_1.FUND_PHASE.BEFORE_CLAIM;
        }
        else if (currentRound >= claimStart && currentRound <= claimEnd) {
            phase = constants_1.FUND_PHASE.DURING_CLAIM;
        }
        else if (currentRound > claimEnd) {
            phase = constants_1.FUND_PHASE.COMPLETED;
        }
        const registration = {
            start: core_1.durationBetweenBlocks(regStart, currentRound),
            end: core_1.durationBetweenBlocks(regEnd, currentRound),
            pending: phase <= constants_1.FUND_PHASE.BEFORE_REGISTRATION,
            active: phase == constants_1.FUND_PHASE.DURING_REGISTRATION,
            completed: phase > constants_1.FUND_PHASE.DURING_REGISTRATION
        };
        const sale = {
            start: core_1.durationBetweenBlocks(saleStart, currentRound),
            end: core_1.durationBetweenBlocks(saleEnd, currentRound),
            pending: phase <= constants_1.FUND_PHASE.BEFORE_SALE,
            active: phase == constants_1.FUND_PHASE.DURING_SALE,
            completed: phase > constants_1.FUND_PHASE.DURING_SALE
        };
        const claim = {
            start: core_1.durationBetweenBlocks(claimStart, currentRound),
            end: core_1.durationBetweenBlocks(claimEnd, currentRound),
            pending: phase <= constants_1.FUND_PHASE.BEFORE_CLAIM,
            active: phase == constants_1.FUND_PHASE.DURING_CLAIM,
            completed: phase > constants_1.FUND_PHASE.DURING_CLAIM
        };
        const status = {
            registration,
            sale,
            phase,
            claim,
            date: Date.now()
        };
        return status;
    }
}
exports.Fundstack = Fundstack;
//# sourceMappingURL=fundstack.js.map