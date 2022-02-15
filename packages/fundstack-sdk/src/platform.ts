import {platformGlobalStateKeys} from "./state/platform";
import * as sdk from "algosdk";
import atob from 'atob';
import {A_Application, A_ApplicationParams} from "@algodesk/core";

export type F_PlatformGlobalState = {
    v: number
    c: string
    cat: number
    dc: number
    e: string
    pf: number
    rf: number
    sf: number
    scp: number
    pemtu: number
}

export function getPlatformState(app: A_Application): F_PlatformGlobalState {
    const gState = app.params['global-state'];
    const globalState = {};

    gState.forEach((gStateProp) => {
        const key = atob(gStateProp.key);
        const {value} = gStateProp;

        if (value.type == 1) {
            if (key == platformGlobalStateKeys.creator || key == platformGlobalStateKeys.escrow) {
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
    params: A_ApplicationParams;
    globalState: F_PlatformGlobalState;

    constructor(app: A_Application) {
        this.id = app.id;
        this.params = app.params;
        this.globalState = getPlatformState(app);
    }

    getId(): number | bigint {
        return this.id;
    }

    getCreator(): string {
        return this.globalState[platformGlobalStateKeys.creator];
    }

    getEscrow(): string {
        return this.globalState[platformGlobalStateKeys.escrow];
    }
}