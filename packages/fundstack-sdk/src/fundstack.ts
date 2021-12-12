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
    A_OptInApplicationParams, A_DeleteApplicationParams, A_SearchTransaction
} from "@algodesk/core";
import {
    FUND_OPERATIONS,
    FUND_PHASE,
    PLATFORM_APP_ID,
    PLATFORM_OPERATIONS,
} from "./constants";
import {getContracts} from "./contracts";
import {OnApplicationComplete, microalgosToAlgos, algosToMicroalgos} from "algosdk";
import {F_AccountActivity, F_CompanyDetails, F_DeployFund, F_FundStatus, F_PhaseDetails} from "./types";
import {Fund, getAccountState} from "./fund";
import atob from 'atob';
import {Platform} from "./platform";
import {localStateKeys, globalStateKeys} from "./state/fund";
import {getAccountActivity} from "@algodesk/fundstack-invest/src/redux/actions/fund";

export class Fundstack {
    algodesk: Algodesk;
    constructor(network: Network, signer?: Signer) {
        this.algodesk = new Algodesk(network, signer);
    }

    async deploy(params: F_DeployFund, company: F_CompanyDetails): Promise<A_SendTxnResponse> {
        const {compiledApprovalProgram, compiledClearProgram} = getContracts();

        const assetParams = await this.getAsset(params.assetId);
        const decimals = assetParams.params.decimals;
        const assetMicros = Math.pow(10, decimals);

        const ints: number[] = [params.assetId, params.regStartsAt, params.regEndsAt, params.saleStartsAt, params.saleEndsAt, params.totalAllocation * assetMicros, params.minAllocation * assetMicros, params.maxAllocation * assetMicros, algosToMicroalgos(params.price)];
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
            foreignApps: [PLATFORM_APP_ID],
            appArgs
        };

        return await this.algodesk.applicationClient.create(fundParams, JSON.stringify(company));
    }

    async publish(fundId: number): Promise<A_SendTxnResponse> {
        const platformApp = await this.algodesk.applicationClient.get(PLATFORM_APP_ID);
        const platform = new Platform(platformApp);
        const platformEscrow = platform.getEscrow();
        console.log('platform escrow: ' + platformEscrow);

        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const creator = fund.getCreator();
        const escrow = fund.getEscrow();
        const assetId = fund.getAssetId();
        const totalAllocation = fund.getTotalAllocation();
        console.log('fund escrow: ' + escrow);

        const assetDetails = await this.getAsset(assetId);
        const micros = Math.pow(10, assetDetails.params.decimals);

        const platformPaymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(creator, platformEscrow, microalgosToAlgos(fund.getPlatformPublishFee()));
        const platformAppTxnParams: A_InvokeApplicationParams = {
            appId: <number>platform.getId(),
            from: creator,
            foreignApps: [fundId],
            foreignAssets: [assetId],
            appArgs: [PLATFORM_OPERATIONS.VALIDATE_FUND]
        };
        const platformAppCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(platformAppTxnParams);

        const paymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(creator, escrow, microalgosToAlgos(fund.getFundEscrowMinTopUp()));

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: creator,
            foreignAssets: [assetId],
            appArgs: [FUND_OPERATIONS.PUBLISH]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        const params: A_TransferAssetParams = {
            from: creator,
            to: escrow,
            assetId,
            amount: totalAllocation / micros
        };
        const assetXferTxn = await this.algodesk.assetClient.prepareTransferTxn(params);
        const txnGroup = this.algodesk.transactionClient.assignGroupID([platformPaymentTxn, platformAppCallTxn, paymentTxn, appCallTxn, assetXferTxn]);

        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async register(fundId: number, address: string): Promise<A_SendTxnResponse> {
        const params: A_OptInApplicationParams = {
            appId: fundId,
            from: address
        };

        const optInTxn = await this.algodesk.applicationClient.optIn(params);
        return optInTxn;
    }

    async invest(fundId: number, address: string, amount: number): Promise<A_SendTxnResponse> {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const escrow = fund.getEscrow();
        const assetId = fund.getAssetId();

        const paymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(address, escrow, amount);

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: address,
            appArgs: [FUND_OPERATIONS.INVEST],
            foreignAssets: [assetId],
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);


        const txnGroup = this.algodesk.transactionClient.assignGroupID([paymentTxn, appCallTxn]);

        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async investorClaim(fundId: number, address: string): Promise<A_SendTxnResponse> {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const assetId = fund.getAssetId();

        const params: A_TransferAssetParams = {
            from: address,
            to: address,
            assetId,
            amount: 0
        };
        const assetXferTxn = await this.algodesk.assetClient.prepareTransferTxn(params);

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: address,
            foreignAssets: [assetId],
            appArgs: [FUND_OPERATIONS.INVESTOR_CLAIM]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        const txnGroup = this.algodesk.transactionClient.assignGroupID([assetXferTxn, appCallTxn]);

        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async investorWithdraw(fundId: number, address: string): Promise<A_SendTxnResponse> {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const assetId = fund.getAssetId();

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: address,
            appArgs: [FUND_OPERATIONS.INVESTOR_WITHDRAW],
            foreignAssets: [assetId]
        };
        const appCallTxn = await this.algodesk.applicationClient.invoke(appTxnParams);

        return appCallTxn;
    }

    async ownerClaim(fundId: number, unsoldAssetAction: string): Promise<A_SendTxnResponse> {
        const platformApp = await this.algodesk.applicationClient.get(PLATFORM_APP_ID);
        const platform = new Platform(platformApp);
        const platformEscrow = platform.getEscrow();

        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const assetId = fund.getAssetId();
        const creator = fund.getCreator();

        const appTxnParams: A_InvokeApplicationParams = {
            appId: fundId,
            from: creator,
            foreignAssets: [assetId],
            appArgs: [FUND_OPERATIONS.OWNER_CLAIM, unsoldAssetAction],
            foreignApps: [PLATFORM_APP_ID],
            foreignAccounts: [platformEscrow]
        };
        const appCallTxn = await this.algodesk.applicationClient.invoke(appTxnParams);

        return appCallTxn;
    }

    async ownerWithdraw(fundId: number): Promise<A_SendTxnResponse> {
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
        const appCallTxn = await this.algodesk.applicationClient.invoke(appTxnParams);

        return appCallTxn;
    }

    async get(fundId: number): Promise<Fund> {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const assetId = fund.getAssetId();
        const escrowAddress = fund.getEscrow();
        const companyDetailsTxId = fund.getCompanyDetailsTxId();

        const [status, asset, escrow, company] = await Promise.all([this.getStatus(fund), this.getAsset(assetId), this.getEscrow(escrowAddress), this.getCompany(companyDetailsTxId)]);

        fund.updateStatusDetails(status);
        fund.updateAssetDetails(asset);
        fund.updateEscrowDetails(escrow);
        fund.updateCompanyDetails(company);

        return fund;
    }

    async getCompany(companyDetailsTxId: string): Promise<F_CompanyDetails> {
        const tx = await this.algodesk.transactionClient.get(companyDetailsTxId);
        const {note} = tx;
        return JSON.parse(atob(note)) as F_CompanyDetails;
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

        const targetReached = this.isTargetReached(fund);

        const claim: F_PhaseDetails = {
            start: durationBetweenBlocks(claimStart, currentRound),
            end: durationBetweenBlocks(claimEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_CLAIM,
            active: phase == FUND_PHASE.DURING_CLAIM && targetReached,
            completed: phase > FUND_PHASE.DURING_CLAIM
        };

        const withdraw: F_PhaseDetails = {
            start: durationBetweenBlocks(claimStart, currentRound),
            end: durationBetweenBlocks(claimEnd, currentRound),
            pending: phase <= FUND_PHASE.BEFORE_CLAIM,
            active: phase == FUND_PHASE.DURING_CLAIM && !targetReached,
            completed: phase > FUND_PHASE.DURING_CLAIM
        };

        const status = {
            registration,
            sale,
            phase,
            claim,
            withdraw,
            targetReached,
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

    async delete(fundId: number): Promise<A_SendTxnResponse> {
        const fundApp = await this.algodesk.applicationClient.get(fundId);
        const fund = new Fund(fundApp);

        const creator = fund.getCreator();
        const params: A_DeleteApplicationParams = {
            appId: fundId,
            from: creator
        };

        const deleteTxn = await this.algodesk.applicationClient.delete(params);
        return deleteTxn;
    }

    async getAccountFundActivity(fundId: number, address: string): Promise<F_AccountActivity[]> {
        const {transactions} = await this.algodesk.applicationClient.getAccountTransactions(fundId, address);

        const activityTxs: F_AccountActivity[] = [];

        transactions.forEach((tx) => {
            const activity: F_AccountActivity = {
                ...tx,
                operation: '',
                label: ''
            };

            const appArgs = tx['application-transaction']['application-args'];
            const createdAppId = tx['created-application-index'];

            let operation = appArgs[0];
            if (operation) {
                operation = atob(operation);
                activity.operation = operation;
            }

            let isValidOperation = false;
            if (createdAppId) {
                isValidOperation = true;
                activity.operation = FUND_OPERATIONS.DEPLOY_FUND;
                activity.label = 'Deploy fund';
            }
            if (operation === FUND_OPERATIONS.PUBLISH) {
                isValidOperation = true;
                activity.label = 'Publish';
            }
            if (operation === FUND_OPERATIONS.OWNER_WITHDRAW) {
                isValidOperation = true;
                activity.label = 'Assets withdraw';
            }
            if (operation === FUND_OPERATIONS.OWNER_CLAIM) {
                isValidOperation = true;
                activity.label = 'Claim algos';
            }

            const isRegister = !createdAppId && tx['application-transaction']['on-completion'] === 'optin';
            if (isRegister) {
                isValidOperation = true;
                activity.operation = FUND_OPERATIONS.REGISTER;
                activity.label = 'Register';
            }
            if (operation == FUND_OPERATIONS.INVEST) {
                isValidOperation = true;
                activity.label = 'Invest';
            }
            if (operation == FUND_OPERATIONS.INVESTOR_CLAIM) {
                isValidOperation = true;
                activity.label = 'Claim';
            }
            if (operation == FUND_OPERATIONS.INVESTOR_WITHDRAW) {
                isValidOperation = true;
                activity.label = 'Withdraw';
            }

            if (isValidOperation) {
                activityTxs.push(activity);
            }
        });
        return activityTxs;
    }

    async getPublishedFundsIds(): Promise<number[]> {
        const fundIds: number[] = [];
        const {transactions} = await this.algodesk.applicationClient.getAppTransactions(PLATFORM_APP_ID);

        transactions.forEach((tx) => {
            const appCallArgs = tx['application-transaction']['application-args'];
            const foreignApps = tx['application-transaction']['foreign-apps'];
            if (appCallArgs && appCallArgs.length > 0 && foreignApps && foreignApps.length > 0) {
                const firstParam = appCallArgs[0];
                if (atob(firstParam) == PLATFORM_OPERATIONS.VALIDATE_FUND) {
                    fundIds.push(foreignApps[0]);
                }
            }
        });
        
        return fundIds;
    }

    hasRegistered(accountInfo: A_AccountInformation, fundId: number): boolean {
        return this.algodesk.applicationClient.hasOpted(accountInfo, fundId);
    }

    hasInvested(accountInfo: A_AccountInformation, fundId: number): boolean {
        let invested = false;

        if (this.hasRegistered(accountInfo, fundId)) {
            const optedApps = this.algodesk.accountClient.getOptedApps(accountInfo);
            optedApps.forEach((app) => {
                if (app.id == fundId) {
                    const accountState = getAccountState(app);
                    invested = accountState[localStateKeys.invested] === 1;
                }
            });
        }

        return invested;
    }

    hasClaimed(accountInfo: A_AccountInformation, fundId: number): boolean {
        let claimed = false;

        if (this.hasRegistered(accountInfo, fundId)) {
            const optedApps = this.algodesk.accountClient.getOptedApps(accountInfo);
            optedApps.forEach((app) => {
                if (app.id == fundId) {
                    const accountState = getAccountState(app);
                    claimed = accountState[localStateKeys.claimed] === 1;
                }
            });
        }

        return claimed;
    }

    hasWithDrawn(accountInfo: A_AccountInformation, fundId: number): boolean {
        let withdrawn = false;

        if (this.hasRegistered(accountInfo, fundId)) {
            const optedApps = this.algodesk.accountClient.getOptedApps(accountInfo);
            optedApps.forEach((app) => {
                if (app.id == fundId) {
                    const accountState = getAccountState(app);
                    withdrawn = accountState[localStateKeys.withdrawn] === 1;
                }
            });
        }

        return withdrawn;
    }

    calculatePayableAmount(amount: number, fund: Fund): number {
        let price = fund.globalState[globalStateKeys.price];
        price = microalgosToAlgos(price);

        let payableAmount = parseFloat((amount * price).toString()).toFixed(6);
        return  parseFloat(payableAmount);
    }

    getMinAllocationInDecimals(fund: Fund): number {
        const minAllocation = fund.globalState[globalStateKeys.min_allocation];
        const decimals = fund.asset.params.decimals
        return minAllocation / Math.pow(10, decimals);
    }

    getMaxAllocationInDecimals(fund: Fund): number {
        const maxAllocation = fund.globalState[globalStateKeys.max_allocation];
        const decimals = fund.asset.params.decimals
        return maxAllocation / Math.pow(10, decimals);
    }

    getTotalAllocationInDecimals(fund: Fund): number {
        const totalAllocation = fund.globalState[globalStateKeys.total_allocation];
        const decimals = fund.asset.params.decimals
        return totalAllocation / Math.pow(10, decimals);
    }

    getPrice(fund: Fund): number {
        const price = fund.globalState[globalStateKeys.price];
        return microalgosToAlgos(price);
    }

    isTargetReached(fund: Fund): boolean {
        return fund.globalState[globalStateKeys.target_reached] === 1;
    }
}