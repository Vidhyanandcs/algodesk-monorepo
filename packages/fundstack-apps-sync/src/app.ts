import {getNetwork} from "./algorand/network";
import {A_SearchTransactions} from "./types";
import moment from 'moment';
import {getContracts} from "./contracts";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Fund from './schemas/fundSchema';
import * as sdk from "algosdk";


dotenv.config();

const network = getNetwork(process.env.NETWORK);
const PLATFORM_APP_ID = Number(process.env.PLATFORM_APP_ID);
const days = Number(process.env.SYNC_DAYS);

const contracts = getContracts();

mongoose.connect('mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASSWORD + '@dappstack.8mpd8.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority', {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected');
});

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

enum globalStateKeys {
    version = "v",
    published = "p",
    creator = "c",
    created_at = "cat",
    name = "n",
    asset_id = "aid",
    reg_starts_at = "rsat",
    reg_ends_at = "reat",
    sale_starts_at = "ssat",
    sale_ends_at = "seat",
    claim_after = "ca",
    total_allocation = "ta",
    remaining_allocation = "ra",
    min_allocation = "mia",
    max_allocation = "mxa",
    price = "price",
    no_of_registrations = "nor",
    no_of_investors = "noi",
    no_of_claims = "noc",
    no_of_withdrawls = "now",
    escrow = "e",
    funds_claimed = "fc",
    company_details = "cd",
    target_reached = "tr",
    funds_withdrawn = "fw",
    remaining_assets_claimed = "rac",
    platform_app_id = "pai",
    platform_escrow = 'pe',
    platform_publish_fee = 'ppf',
    platform_success_fee = 'psf',
    platform_fund_escrow_min_top_up = 'pfemtu',
    platform_success_criteria_percentage = "pscp"
}

function getFundState(fund) {
    const gState = fund.params['global-state'];
    const globalState = {};

    gState.forEach((gStateProp) => {
        const key = atob(gStateProp.key);
        const {value} = gStateProp;

        if (value.type == 1) {
            if (key == globalStateKeys.creator || key == globalStateKeys.escrow || key == globalStateKeys.platform_escrow) {
                globalState[key] = sdk.encodeAddress(new Uint8Array(Buffer.from(value.bytes, "base64")));
            }
            else {
                globalState[key] = atob(value.bytes);
            }
        }
        else {
            globalState[key] = value.uint;
        }
    });

    return globalState;
}

async function syncFund(fundId: number) {
    const fund = await getApplication(fundId);
    const approvalProgram = fund.params['approval-program'];
    if (approvalProgram === contracts.compiledApprovalProgram.result) {
        const globalState = getFundState(fund);

        Fund.findOne({app_id: fund.id}, function (err, fundRecord) {
            if (err) {
                console.log(err);
            }
            if (!fundRecord) {
                new Fund({ app_id: fund.id, asset_id: globalState[globalStateKeys.asset_id], name: globalState[globalStateKeys.name], price: globalState[globalStateKeys.price]}).save(function (err, fundRecord) {
                    if (err){
                        console.log(err);
                    }
                    console.log(fundRecord);
                });
            }
        });
    }
}

async function sync() {
    const fundIds = await getFundStackApps(PLATFORM_APP_ID);
    fundIds.forEach((fundId) => {
        syncFund(fundId);
    });
}

sync();

