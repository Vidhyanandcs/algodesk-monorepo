import {getNetwork} from "./algorand/network";
import {A_Application, A_Asset, A_SearchTransactions, F_FundGlobalState} from "./types";
import moment from 'moment';
import {getContracts} from "./contracts";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Fund from './schemas/fundSchema';
import * as sdk from "algosdk";
import {globalStateKeys} from "./constants";
import atob from 'atob';


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

async function getFundStackApps(appId: number): Promise<number[]> {
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

async function getApplication(id: number): Promise<A_Application> {
    return await network.getClient().getApplicationByID(id).do() as A_Application;
}

async function getAsset(id: number): Promise<A_Asset> {
    return await network.getClient().getAssetByID(id).do() as A_Asset;
}

function getFundState(fund): F_FundGlobalState {
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

    return globalState as F_FundGlobalState;
}

async function syncFund(fundId: number) {
    const fund = await getApplication(fundId);
    const approvalProgram = fund.params['approval-program'];
    if (approvalProgram === contracts.compiledApprovalProgram.result) {
        const globalState = getFundState(fund);
        const asset = await getAsset(globalState[globalStateKeys.asset_id]);

        Fund.findOne({app_id: fund.id}, function (err, fundRecord) {
            if (err) {
                console.log(err);
            }
            if (!fundRecord) {
                new Fund({ app_id: fund.id, total_allocation: globalState[globalStateKeys.total_allocation] / Math.pow(10, asset.params.decimals), asset_unit: asset.params["unit-name"], asset_id: globalState[globalStateKeys.asset_id], name: globalState[globalStateKeys.name], price: globalState[globalStateKeys.price]}).save(function (err, fundRecord) {
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

