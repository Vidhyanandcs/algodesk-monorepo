import {Application, ApplicationParams} from "algosdk/dist/types/src/client/v2/algod/models/types";
import {globalStateKeys} from "./state";
import * as sdk from "algosdk";
import atob from 'atob';

export type F_RevenueGlobalState = {
    v: number
    c: string
    cat: number
    fd: number
    e: string
}

export function getRevenueState(fund: Application): F_RevenueGlobalState {
    const gState = fund.params['global-state'];
    const globalState = {};

    gState.forEach((gStateProp) => {
        const key = atob(gStateProp.key);
        const {value} = gStateProp;

        if (value.type == 1) {
            if (key == globalStateKeys.creator || key == globalStateKeys.escrow) {
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

    return globalState as F_RevenueGlobalState;
}

export class Revenue {
    id: number | bigint;
    params: ApplicationParams;
    globalState: F_RevenueGlobalState;

    constructor(revenue: Application) {
        this.id = revenue.id;
        this.params = revenue.params;
        this.globalState = getRevenueState(revenue);
    }

    getId(): number | bigint {
        return this.id;
    }

    getCreator(): string {
        return this.globalState[globalStateKeys.creator];
    }

    getEscrow(): string {
        return this.globalState[globalStateKeys.escrow];
    }
}