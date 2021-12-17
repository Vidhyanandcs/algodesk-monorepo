import {getNetwork} from "./algorand/network";
import {A_SearchTransactions} from "./types";

const network = getNetwork("betanet");
const PLATFORM_APP_ID = 438565946;

async function getAppTransactions(appId: number): Promise<A_SearchTransactions> {
    const transactions = await network.getIndexer().searchForTransactions().applicationID(appId).do();
    return transactions as A_SearchTransactions;
}

async function getFundStackApps(appId: number) {
    const fundIds: number[] = [];
    const {transactions} = await getAppTransactions(appId);

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

    console.log(fundIds);
}

getFundStackApps(PLATFORM_APP_ID);