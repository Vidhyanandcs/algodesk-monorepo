import {Application, ApplicationParams} from "algosdk/dist/types/src/client/v2/algod/models/types";
import {globalStateKeys} from "./state";
import * as sdk from "algosdk";
import atob from 'atob';

export type F_PlatformGlobalState = {
    v: number
    c: string
    cat: number
    fd: number
    e: string
}

export function getPlatformState(fund: Application): F_PlatformGlobalState {
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

    return globalState as F_PlatformGlobalState;
}

export class Platform {
    id: number | bigint;
    params: ApplicationParams;
    globalState: F_PlatformGlobalState;

    constructor(app: Application) {
        this.id = app.id;
        this.params = app.params;
        this.globalState = getPlatformState(app);
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