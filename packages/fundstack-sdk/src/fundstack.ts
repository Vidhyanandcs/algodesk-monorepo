import {
    A_CreateApplicationParams,
    Algodesk,
    getUintProgram,
    Network,
    Signer,
    A_SendTxnResponse,
    numToUint, A_InvokeApplicationParams, A_TransferAssetParams
} from "@algodesk/core";
import {ESCROW_MIN_TOP_UP, FUND_OPERATIONS} from "./constants";
import {getContracts} from "./contracts";
import {assignGroupID, OnApplicationComplete} from "algosdk";
import {F_DeployFund} from "./types";
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
}