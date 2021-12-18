import {getNetwork} from "./algorand/network";
import {A_SearchTransactions} from "./types";
import moment from 'moment';
import {getContracts} from "./contracts";

const network = getNetwork("betanet");
const PLATFORM_APP_ID = 438565946;
const days = 1;
const contracts = getContracts();

async function getAppTransactions(appId: number, days: number): Promise<A_SearchTransactions> {
    // @ts-ignore
    const now = new moment();
    now.subtract(days - 1, 'days');
    const RFC_3339_FMT = 'YYYY-MM-DD';

    const transactions = await network.getIndexer().searchForTransactions().applicationID(appId).afterTime(now.format(RFC_3339_FMT)).do();
    return transactions as A_SearchTransactions;
}

async function getFundStackApps(appId: number) {
    const fundIds: number[] = [];
    const {transactions} = await getAppTransactions(appId, days);

    transactions.forEach((tx) => {
        const appCallArgs = tx['application-transaction']['application-args'];
        const foreignApps = tx['application-transaction']['foreign-apps'];
        if (appCallArgs && appCallArgs.length > 0 && foreignApps && foreignApps.length > 0) {
            const firstParam = appCallArgs[0];
            if (atob(firstParam) == "validate_fund") {
                fundIds.push(foreignApps[0]);
            }
        }
    });

    return fundIds;
}

async function getApplication(id: number) {
    return await network.getClient().getApplicationByID(id).do();
}

async function syncFund(fundId: number) {
    const fund = await getApplication(fundId);
    const approvalProgram = fund.params['approval-program'];
    if (approvalProgram === contracts.compiledApprovalProgram.result) {
        console.log(fund.id);
    }
}

async function sync() {
    const fundIds = await getFundStackApps(PLATFORM_APP_ID);
    fundIds.forEach((fundId) => {
        syncFund(fundId);
    });
}

sync();

