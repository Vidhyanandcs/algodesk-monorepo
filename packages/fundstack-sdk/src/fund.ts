import {Application, ApplicationParams} from "algosdk/dist/types/src/client/v2/algod/models/types";
import {globalStateKeys} from "./state";
import * as sdk from "algosdk";
import algodeskCore from "@algodesk/core";
import atob from 'atob';

export type F_FundState = {
    v: number
    s: number
    c: string
    cat: number
    n: string
    aid: number
    rsat: number
    reat: number
    ssat: number
    seat: number
    ca: number
    ta: number
    ra: number
    mia: number
    mxa: number
    sr: number
    nor: number
    noi: number
    noc: number
    e: string
    fc: boolean
    cd: string
    tr: boolean
    fw: boolean
    rac: boolean
}

export function getFundState(fund: Application): F_FundState {
    const gState = fund.params['global-state'];
    const globalState = {};

    gState.forEach((gStateProp) => {
        const key = atob(gStateProp.key);
        const {value} = gStateProp;

        if (value.type == 1) {
            if (key == globalStateKeys.creator || key == globalStateKeys.escrow) {
                globalState[key] = sdk.encodeAddress(new Uint8Array(Buffer.from(value.bytes, "base64")));
            }
            else if (key == globalStateKeys.company_details) {
                globalState[key] = algodeskCore.encodeTxId(new Uint8Array(Buffer.from(value.bytes, "base64")));
            }
            else {
                globalState[key] = atob(value.bytes);
            }
        }
        else {
            globalState[key] = value.uint;
        }
    });

    return globalState as F_FundState;
}

export function getAccountState(localApp) {
    const lState = localApp['key-value'];
    const localState = {};

    lState.forEach((lStateProp) => {
        const key = atob(lStateProp.key);
        const {value} = lStateProp;

        if (value.type == 1) {
            localState[key] = atob(value.bytes);
        }
        else {
            localState[key] = value.uint;
        }
    });

    return localState;
}

export class Fund {
    id: number | bigint;
    params: ApplicationParams;
    state: F_FundState;

    constructor(fund: Application) {
        this.id = fund.id;
        this.params = fund.params;
        this.state = getFundState(fund);
    }

    getCreator(): string {
        return this.state[globalStateKeys.creator];
    }

    getEscrow(): string {
        return this.state[globalStateKeys.escrow];
    }

    getAssetId(): number {
        return this.state[globalStateKeys.asset_id];
    }

    getTotalAllocation(): number {
        return this.state[globalStateKeys.total_allocation];
    }
}