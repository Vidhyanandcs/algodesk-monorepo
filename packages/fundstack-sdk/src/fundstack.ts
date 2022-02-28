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
    A_OptInApplicationParams, A_DeleteApplicationParams, A_Application, isNumber
} from "@algodesk/core";
import {
    POOL_OPERATIONS,
    POOL_PHASE,
    PLATFORM_OPERATIONS, IPFS_SERVER,
} from "./constants";
import {getContracts} from "./contracts";
import {OnApplicationComplete, microalgosToAlgos, algosToMicroalgos} from "algosdk";
import {
    F_AccountActivity,
    F_DB_POOL,
    F_CreatePool,
    F_PoolStatus,
    F_PhaseDetails,
    F_PoolMetaData
} from "./types";
import {Pool, getAccountState} from "./pool";
import atob from 'atob';
import {Platform} from "./platform";
import {localStateKeys, globalStateKeys} from "./state/pool";
import humanizeDuration from 'humanize-duration';
import axios from "axios";
import isEmpty from 'is-empty';

const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: "shortEn",
    languages: {
        shortEn: {
            y: () => "y",
            mo: () => "mo",
            w: () => "w",
            d: () => "d",
            h: () => "h",
            m: () => "m",
            s: () => "s",
            ms: () => "ms",
        },
    },
});

export class Fundstack {
    algodesk: Algodesk;
    platformAppId: number;
    network: string;
    constructor(platformAppId: number, network: Network, signer?: Signer) {
        this.algodesk = new Algodesk(network, signer);
        this.platformAppId = platformAppId;
        this.network = network.name;
    }

    validatePoolParams(poolParams: F_CreatePool): boolean {
        const {
            name,
            assetId,
            totalAllocation,
            minAllocation,
            maxAllocation,
            price,
            regStartsAt,
            regEndsAt,
            saleStartsAt,
            saleEndsAt,
            metadataCid,
            logoCid
        } = poolParams;

        if (isEmpty(name)) {
            throw Error('Invalid name');
        }
        if (isEmpty(metadataCid)) {
            throw Error('Invalid metadataCid');
        }
        if (isEmpty(logoCid)) {
            throw Error('Invalid logoCid');
        }
        if (isEmpty(assetId)) {
            throw Error('Invalid asset');
        }
        if (isEmpty(totalAllocation)) {
            throw Error('Invalid totalAllocation');
        }
        if (isEmpty(minAllocation)) {
            throw Error('Invalid minAllocation');
        }
        if (isEmpty(maxAllocation)) {
            throw Error('Invalid maxAllocation');
        }
        if (isEmpty(price)) {
            throw Error('Invalid price');
        }
        if (regStartsAt < 0) {
            throw Error('Registration start date cannot be in the past');
        }
        if (regStartsAt < 0) {
            throw Error('Registration start date cannot be in the past');
        }
        if (regEndsAt < 0) {
            throw Error('Registration end date cannot be in the past');
        }
        if (saleStartsAt < 0) {
            throw Error('Sale start date cannot be in the past');
        }
        if (saleEndsAt < 0) {
            throw Error('Sale end date cannot be in the past');
        }
        if (regEndsAt < regStartsAt) {
            throw Error('Registration end date should be greater that registration start date');
        }
        if (saleStartsAt < regEndsAt) {
            throw Error('Sale start date should be greater that registration end date');
        }
        if (saleEndsAt < saleStartsAt) {
            throw Error('Sale end date should be greater that sale start date');
        }

        return true;
    }

    async createPool(params: F_CreatePool): Promise<A_SendTxnResponse> {
        this.validatePoolParams(params);
        const {compiledApprovalProgram, compiledClearProgram} = getContracts(this.network);

        const assetParams = await this.getAsset(params.assetId);
        const decimals = assetParams.params.decimals;
        const assetMicros = Math.pow(10, decimals);

        const ints: any [] = [params.assetId, params.regStartsAt, params.regEndsAt, params.saleStartsAt, params.saleEndsAt, params.totalAllocation * assetMicros, params.minAllocation * assetMicros, params.maxAllocation * assetMicros, algosToMicroalgos(params.price)];
        const intsUint = [];
        ints.forEach((item) => {
            intsUint.push(numToUint(parseInt(String(item))));
        });

        const appArgs = [params.name, ...intsUint, params.metadataCid, params.logoCid];

        const poolParams: A_CreateApplicationParams = {
            from: params.from,
            approvalProgram: getUintProgram(compiledApprovalProgram.result),
            clearProgram: getUintProgram(compiledClearProgram.result),
            globalBytes: 30,
            globalInts: 30,
            localBytes: 7,
            localInts: 7,
            onComplete: OnApplicationComplete.NoOpOC,
            foreignApps: [this.platformAppId],
            appArgs
        };

        return await this.algodesk.applicationClient.create(poolParams);
    }

    async publish(poolId: number): Promise<A_SendTxnResponse> {
        const platformApp = await this.algodesk.applicationClient.get(this.platformAppId);
        const platform = new Platform(platformApp);
        const platformEscrow = platform.getEscrow();
        console.log('platform escrow: ' + platformEscrow);

        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        const owner = pool.getOwner();
        const escrow = pool.getEscrow();
        const assetId = pool.getAssetId();
        const totalAllocation = pool.getTotalAllocation();
        console.log('pool escrow: ' + escrow);

        const assetDetails = await this.getAsset(assetId);
        const micros = Math.pow(10, assetDetails.params.decimals);

        const platformPaymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(owner, platformEscrow, microalgosToAlgos(pool.getPlatformPublishFee()));
        const platformAppTxnParams: A_InvokeApplicationParams = {
            appId: <number>platform.getId(),
            from: owner,
            foreignApps: [poolId],
            foreignAssets: [assetId],
            appArgs: [PLATFORM_OPERATIONS.VALIDATE_POOL]
        };
        const platformAppCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(platformAppTxnParams);

        const paymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(owner, escrow, microalgosToAlgos(pool.getPoolEscrowMinTopUp()));

        const appTxnParams: A_InvokeApplicationParams = {
            appId: poolId,
            from: owner,
            foreignAssets: [assetId],
            appArgs: [POOL_OPERATIONS.PUBLISH]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        const params: A_TransferAssetParams = {
            from: owner,
            to: escrow,
            assetId,
            amount: totalAllocation / micros
        };
        const assetXferTxn = await this.algodesk.assetClient.prepareTransferTxn(params);
        const txnGroup = this.algodesk.transactionClient.assignGroupID([platformPaymentTxn, platformAppCallTxn, paymentTxn, appCallTxn, assetXferTxn]);

        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async register(poolId: number, address: string): Promise<A_SendTxnResponse> {
        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        const escrow = pool.getEscrow();
        const regFee = pool.getPlatformRegistrationFee();

        const paymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(address, escrow, microalgosToAlgos(regFee));

        const params: A_OptInApplicationParams = {
            appId: poolId,
            from: address
        };
        const optInTxn = await this.algodesk.applicationClient.prepareOptInTxn(params);

        const txnGroup = this.algodesk.transactionClient.assignGroupID([paymentTxn, optInTxn]);
        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async invest(poolId: number, address: string, amount: number): Promise<A_SendTxnResponse> {
        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        const escrow = pool.getEscrow();
        const assetId = pool.getAssetId();

        const paymentTxn = await this.algodesk.paymentClient.preparePaymentTxn(address, escrow, amount);

        const appTxnParams: A_InvokeApplicationParams = {
            appId: poolId,
            from: address,
            appArgs: [POOL_OPERATIONS.INVEST],
            foreignAssets: [assetId],
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);


        const txnGroup = this.algodesk.transactionClient.assignGroupID([paymentTxn, appCallTxn]);

        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async investorClaim(poolId: number, address: string): Promise<A_SendTxnResponse> {
        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        const assetId = pool.getAssetId();

        const params: A_TransferAssetParams = {
            from: address,
            to: address,
            assetId,
            amount: 0
        };
        const assetXferTxn = await this.algodesk.assetClient.prepareTransferTxn(params);

        const appTxnParams: A_InvokeApplicationParams = {
            appId: poolId,
            from: address,
            foreignAssets: [assetId],
            appArgs: [POOL_OPERATIONS.INVESTOR_CLAIM]
        };
        const appCallTxn = await this.algodesk.applicationClient.prepareInvokeTxn(appTxnParams);

        const txnGroup = this.algodesk.transactionClient.assignGroupID([assetXferTxn, appCallTxn]);

        return await this.algodesk.transactionClient.sendGroupTxns(txnGroup);
    }

    async investorWithdraw(poolId: number, address: string): Promise<A_SendTxnResponse> {
        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        const assetId = pool.getAssetId();

        const appTxnParams: A_InvokeApplicationParams = {
            appId: poolId,
            from: address,
            appArgs: [POOL_OPERATIONS.INVESTOR_WITHDRAW],
            foreignAssets: [assetId]
        };
        const appCallTxn = await this.algodesk.applicationClient.invoke(appTxnParams);

        return appCallTxn;
    }

    async ownerClaim(poolId: number, unsoldAssetAction: string): Promise<A_SendTxnResponse> {
        const platformApp = await this.algodesk.applicationClient.get(this.platformAppId);
        const platform = new Platform(platformApp);
        const platformEscrow = platform.getEscrow();

        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        const assetId = pool.getAssetId();
        const owner = pool.getOwner();

        const appTxnParams: A_InvokeApplicationParams = {
            appId: poolId,
            from: owner,
            foreignAssets: [assetId],
            appArgs: [POOL_OPERATIONS.OWNER_CLAIM, unsoldAssetAction],
            foreignApps: [this.platformAppId],
            foreignAccounts: [platformEscrow]
        };
        const appCallTxn = await this.algodesk.applicationClient.invoke(appTxnParams);

        return appCallTxn;
    }

    async ownerWithdraw(poolId: number): Promise<A_SendTxnResponse> {
        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        const assetId = pool.getAssetId();
        const owner = pool.getOwner();

        const appTxnParams: A_InvokeApplicationParams = {
            appId: poolId,
            from: owner,
            foreignAssets: [assetId],
            appArgs: [POOL_OPERATIONS.OWNER_WITHDRAW]
        };
        const appCallTxn = await this.algodesk.applicationClient.invoke(appTxnParams);

        return appCallTxn;
    }

    async getPool(poolId: number): Promise<Pool> {
        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        if (pool.valid) {
            const assetId = pool.getAssetId();
            const escrowAddress = pool.getEscrow();
            const metaDataCId = pool.getMetaDataCId();

            const [status, asset, escrow, metadata] = await Promise.all([this.getStatus(pool), this.getAsset(assetId), this.getEscrow(escrowAddress), this.getMetaData(metaDataCId)]);

            pool.updateStatusDetails(status);
            pool.updateAssetDetails(asset);
            pool.updateEscrowDetails(escrow);
            pool.updateMetaDataDetails(metadata);
        }

        return pool;
    }

    async getMetaData(metaDataCId: string): Promise<F_PoolMetaData> {
        const url = this.getIpfsLink(metaDataCId);
        const response = await axios.get(url);
        return response.data as F_PoolMetaData;
    }

    async getStatus(pool: Pool): Promise<F_PoolStatus> {
        const suggestedParams = await this.algodesk.transactionClient.getSuggestedParams();
        const currentRound = suggestedParams.firstRound;

        const regStart = pool.getRegStart();
        const regEnd = pool.getRegEnd();

        const saleStart = pool.getSaleStart();
        const saleEnd = pool.getSaleEnd();

        const claimStart = pool.getClaimStart();
        const claimEnd = pool.getClaimEnd();

        let phase = 0;

        if (currentRound < regStart) {
            phase = POOL_PHASE.BEFORE_REGISTRATION;
        }
        else if(currentRound >= regStart && currentRound <= regEnd) {
            phase = POOL_PHASE.DURING_REGISTRATION;
        }
        else if(currentRound > regEnd && currentRound < saleStart) {
            phase = POOL_PHASE.BEFORE_SALE;
        }
        else if(currentRound >= saleStart && currentRound <= saleEnd) {
            phase = POOL_PHASE.DURING_SALE;
        }
        else if(currentRound > saleEnd && currentRound < claimStart) {
            phase = POOL_PHASE.BEFORE_CLAIM;
        }
        else if(currentRound >= claimStart && currentRound <= claimEnd) {
            phase = POOL_PHASE.DURING_CLAIM;
        }
        else if(currentRound > claimEnd) {
            phase = POOL_PHASE.COMPLETED;
        }

        const registration: F_PhaseDetails = {
            pending: phase <= POOL_PHASE.BEFORE_REGISTRATION,
            active: phase == POOL_PHASE.DURING_REGISTRATION,
            completed: phase > POOL_PHASE.DURING_REGISTRATION,
            durationHumanize: "",
            durationReadable: "",
            durationMilliSeconds: 0,
        };

        if (registration.pending) {
            const duration = durationBetweenBlocks(regStart, currentRound);
            const milliseconds = duration.milliseconds;
            registration.durationMilliSeconds = milliseconds;
            registration.durationHumanize = shortEnglishHumanizer(milliseconds, {largest: 2});
            registration.durationReadable = registration.durationHumanize;
        }
        if (registration.active) {
            const duration = durationBetweenBlocks(regEnd, currentRound);
            const milliseconds = duration.milliseconds;
            registration.durationMilliSeconds = milliseconds;
            registration.durationHumanize = shortEnglishHumanizer(milliseconds, {largest: 2});
            registration.durationReadable = registration.durationHumanize;
        }

        const sale: F_PhaseDetails = {
            pending: phase <= POOL_PHASE.BEFORE_SALE,
            active: phase == POOL_PHASE.DURING_SALE,
            completed: phase > POOL_PHASE.DURING_SALE,
            durationHumanize: "",
            durationReadable: "",
            durationMilliSeconds: 0,
        };

        if (sale.pending) {
            const duration = durationBetweenBlocks(saleStart, currentRound);
            const milliseconds = duration.milliseconds;
            sale.durationMilliSeconds = milliseconds;
            sale.durationHumanize = shortEnglishHumanizer(milliseconds, {largest: 2});
            sale.durationReadable = sale.durationHumanize;
        }
        if (sale.active) {
            const duration = durationBetweenBlocks(saleEnd, currentRound);
            const milliseconds = duration.milliseconds;
            sale.durationMilliSeconds = milliseconds;
            sale.durationHumanize = shortEnglishHumanizer(milliseconds, {largest: 2});
            sale.durationReadable = sale.durationHumanize;
        }

        const targetReached = this.isTargetReached(pool);

        const claim: F_PhaseDetails = {
            pending: phase <= POOL_PHASE.BEFORE_CLAIM,
            active: phase == POOL_PHASE.DURING_CLAIM && targetReached,
            completed: phase > POOL_PHASE.DURING_CLAIM,
            durationHumanize: "",
            durationReadable: "",
            durationMilliSeconds: 0,
        };

        if (claim.pending) {
            const duration = durationBetweenBlocks(claimStart, currentRound);
            const milliseconds = duration.milliseconds;
            claim.durationMilliSeconds = milliseconds;
            claim.durationHumanize = shortEnglishHumanizer(milliseconds, {largest: 2});
            claim.durationReadable = claim.durationHumanize;
        }
        if (claim.active) {
            const duration = durationBetweenBlocks(claimEnd, currentRound);
            const milliseconds = duration.milliseconds;
            claim.durationMilliSeconds = milliseconds;
            claim.durationHumanize = shortEnglishHumanizer(milliseconds, {largest: 2});
            claim.durationReadable = claim.durationHumanize;
        }
        
        const withdraw: F_PhaseDetails = {
            pending: phase <= POOL_PHASE.BEFORE_CLAIM,
            active: phase == POOL_PHASE.DURING_CLAIM && !targetReached,
            completed: phase > POOL_PHASE.DURING_CLAIM,
            durationHumanize: "",
            durationReadable: "",
            durationMilliSeconds: 0,
        };

        if (withdraw.pending) {
            const duration = durationBetweenBlocks(claimStart, currentRound);
            const milliseconds = duration.milliseconds;
            withdraw.durationMilliSeconds = milliseconds;
            withdraw.durationHumanize = shortEnglishHumanizer(milliseconds, {largest: 2});
            withdraw.durationReadable = withdraw.durationHumanize;
        }
        if (withdraw.active) {
            const duration = durationBetweenBlocks(claimEnd, currentRound);
            const milliseconds = duration.milliseconds;
            withdraw.durationMilliSeconds = milliseconds;
            withdraw.durationHumanize = shortEnglishHumanizer(milliseconds, {largest: 2});
            withdraw.durationReadable = withdraw.durationHumanize;
        }
        
        const status = {
            registration,
            sale,
            phase,
            claim,
            withdraw,
            targetReached,
            published: pool.isPublished(),
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

    async delete(poolId: number): Promise<A_SendTxnResponse> {
        const poolApp = await this.algodesk.applicationClient.get(poolId);
        const pool = new Pool(poolApp, this.network);

        const owner = pool.getOwner();
        const params: A_DeleteApplicationParams = {
            appId: poolId,
            from: owner
        };

        const deleteTxn = await this.algodesk.applicationClient.delete(params);
        return deleteTxn;
    }

    async getAccountPoolActivity(poolId: number, address: string): Promise<F_AccountActivity[]> {
        const {transactions} = await this.algodesk.applicationClient.getAccountTransactions(poolId, address);

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
                activity.operation = POOL_OPERATIONS.CREATE_POOL;
                activity.label = 'Create pool';
            }
            if (operation === POOL_OPERATIONS.PUBLISH) {
                isValidOperation = true;
                activity.label = 'Publish pool';
            }
            if (operation === POOL_OPERATIONS.OWNER_WITHDRAW) {
                isValidOperation = true;
                activity.label = 'Withdraw assets';
            }
            if (operation === POOL_OPERATIONS.OWNER_CLAIM) {
                isValidOperation = true;
                activity.label = 'Claim amount';
            }

            const isRegister = !createdAppId && tx['application-transaction']['on-completion'] === 'optin';
            if (isRegister) {
                isValidOperation = true;
                activity.operation = POOL_OPERATIONS.REGISTER;
                activity.label = 'Registered';
            }
            if (operation == POOL_OPERATIONS.INVEST) {
                isValidOperation = true;
                activity.label = 'Invested';
            }
            if (operation == POOL_OPERATIONS.INVESTOR_CLAIM) {
                isValidOperation = true;
                activity.label = 'Claimed';
            }
            if (operation == POOL_OPERATIONS.INVESTOR_WITHDRAW) {
                isValidOperation = true;
                activity.label = 'Withdrawn';
            }

            if (isValidOperation) {
                activityTxs.push(activity);
            }
        });
        return activityTxs;
    }

    async getPublishedPools(apiBaseUrl: string): Promise<F_DB_POOL[]> {
        const response = await axios({
            method: 'get',
            url: apiBaseUrl + '/v1/pools'
        });

        return response.data;
    }

    getAccountPools(accountInfo: A_AccountInformation): A_Application[] {
        let pools:A_Application[] = [];

        const contracts = getContracts(this.network);
        const {compiledApprovalProgram, compiledClearProgram} = contracts;
        const apps = this.algodesk.accountClient.getCreatedApps(accountInfo);

        apps.forEach((app) => {
            const appApprovalProgram = app.params["approval-program"];
            const appClearProgram = app.params["clear-state-program"];

            if (appApprovalProgram === compiledApprovalProgram.result && appClearProgram === compiledClearProgram.result) {
                pools.push(app);
            }
        });

        pools = pools.sort((a, b) => {
            return b.id - a.id;
        });

        return pools;
    }

    async getInvestedPools(apiBaseUrl: string, address: string): Promise<F_DB_POOL[]> {
        const response = await axios({
            method: 'get',
            url: apiBaseUrl + '/v1/account/' + address + '/pools'
        });

        return response.data;
    }

    hasRegistered(accountInfo: A_AccountInformation, poolId: number): boolean {
        return this.algodesk.applicationClient.hasOpted(accountInfo, poolId);
    }

    hasInvested(accountInfo: A_AccountInformation, poolId: number): boolean {
        let invested = false;

        if (this.hasRegistered(accountInfo, poolId)) {
            const optedApps = this.algodesk.accountClient.getOptedApps(accountInfo);
            optedApps.forEach((app) => {
                if (app.id == poolId) {
                    const accountState = getAccountState(app);
                    invested = accountState[localStateKeys.invested] === 1;
                }
            });
        }

        return invested;
    }

    hasClaimed(accountInfo: A_AccountInformation, poolId: number): boolean {
        let claimed = false;

        if (this.hasRegistered(accountInfo, poolId)) {
            const optedApps = this.algodesk.accountClient.getOptedApps(accountInfo);
            optedApps.forEach((app) => {
                if (app.id == poolId) {
                    const accountState = getAccountState(app);
                    claimed = accountState[localStateKeys.claimed] === 1;
                }
            });
        }

        return claimed;
    }

    hasWithDrawn(accountInfo: A_AccountInformation, poolId: number): boolean {
        let withdrawn = false;

        if (this.hasRegistered(accountInfo, poolId)) {
            const optedApps = this.algodesk.accountClient.getOptedApps(accountInfo);
            optedApps.forEach((app) => {
                if (app.id == poolId) {
                    const accountState = getAccountState(app);
                    withdrawn = accountState[localStateKeys.withdrawn] === 1;
                }
            });
        }

        return withdrawn;
    }

    calculatePayableAmount(amount: number, pool: Pool): number {
        let price = pool.globalState[globalStateKeys.price];
        price = microalgosToAlgos(price);

        let payableAmount = parseFloat((amount * price).toString()).toFixed(6);
        return  parseFloat(payableAmount);
    }

    getMinAllocationInDecimals(pool: Pool): number {
        const minAllocation = pool.globalState[globalStateKeys.min_allocation];
        const decimals = pool.asset.params.decimals
        return minAllocation / Math.pow(10, decimals);
    }

    getMaxAllocationInDecimals(pool: Pool): number {
        const maxAllocation = pool.globalState[globalStateKeys.max_allocation];
        const decimals = pool.asset.params.decimals
        return maxAllocation / Math.pow(10, decimals);
    }

    getTotalAllocationInDecimals(pool: Pool): number {
        const totalAllocation = pool.globalState[globalStateKeys.total_allocation];
        const decimals = pool.asset.params.decimals
        return totalAllocation / Math.pow(10, decimals);
    }

    getRemainingAllocationInDecimals(pool: Pool): number {
        const remainingAllocation = pool.globalState[globalStateKeys.remaining_allocation];
        const decimals = pool.asset.params.decimals
        return remainingAllocation / Math.pow(10, decimals);
    }

    getSoldAllocationInDecimals(pool: Pool): number {
        return this.getTotalAllocationInDecimals(pool) - this.getRemainingAllocationInDecimals(pool);
    }

    getPrice(pool: Pool): number {
        const price = pool.globalState[globalStateKeys.price];
        return microalgosToAlgos(price);
    }

    getTotalAmountRaised(pool: Pool): number {
        return this.getSoldAllocationInDecimals(pool) * this.getPrice(pool);
    }

    getSuccessCriteriaPercentage(pool: Pool): number {
        return  pool.globalState[globalStateKeys.platform_success_criteria_percentage];
    }

    isTargetReached(pool: Pool): boolean {
        return pool.globalState[globalStateKeys.target_reached] === 1;
    }

    getIpfsLink(cid: string): string {
        return IPFS_SERVER + cid;
    }
}