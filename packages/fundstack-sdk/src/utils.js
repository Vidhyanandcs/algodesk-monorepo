import {globalStateKeys, localStateKeys} from "./state";
import * as sdk from "algosdk";
import {encodeTxId} from "@algodesk/sdk";
import atob from 'atob';

export function getFundState(fund) {
    const {globalState} = fund;
    return globalState[globalStateKeys.state]
}

export function getGlobalState(fund) {
    const gState = fund.params['global-state'];
    const globalState = {};

    gState.forEach((gStateProp) => {
        const key = atob(gStateProp.key);
        const {value} = gStateProp;

        if (value.type == 1) {
            if (key == globalStateKeys.creator || key == globalStateKeys.escrow) {
                globalState[key] = sdk.encodeAddress(new Uint8Array(Buffer.from(value.bytes, "base64")));;
            }
            else if (key == globalStateKeys.company_details) {
                globalState[key] = encodeTxId(new Uint8Array(Buffer.from(value.bytes, "base64")));;
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

export function getLocalState(localApp) {
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