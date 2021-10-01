import {Application, ApplicationParams} from "algosdk/dist/types/src/client/v2/algod/models/types";
import {globalStateKeys} from "./state";
import * as sdk from "algosdk";
import algodeskCore, {A_AccountInformation, A_Asset} from "@algodesk/core";
import atob from 'atob';
import {F_CompanyDetails, F_FundStatus} from "./types";

export type F_FundGlobalState = {
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

export function getFundState(fund: Application): F_FundGlobalState {
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

    return globalState as F_FundGlobalState;
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
    globalState: F_FundGlobalState;
    published: boolean;
    status: F_FundStatus;
    asset: A_Asset;
    escrow: A_AccountInformation;
    company: F_CompanyDetails;

    constructor(fund: Application) {
        this.id = fund.id;
        this.params = fund.params;
        this.globalState = getFundState(fund);
        this.published = this.getState() >= 3;
    }

    getCreator(): string {
        return this.globalState[globalStateKeys.creator];
    }

    getEscrow(): string {
        return this.globalState[globalStateKeys.escrow];
    }

    getAssetId(): number {
        return this.globalState[globalStateKeys.asset_id];
    }

    getState(): number {
        return this.globalState[globalStateKeys.state];
    }

    getTotalAllocation(): number {
        return this.globalState[globalStateKeys.total_allocation];
    }

    getCompanyDetailsTxId(): string {
        return this.globalState[globalStateKeys.company_details];
    }

    getRegStart(): number {
        return this.globalState[globalStateKeys.reg_starts_at];
    }

    getRegEnd(): number {
        return this.globalState[globalStateKeys.reg_ends_at];
    }

    getSaleStart(): number {
        return this.globalState[globalStateKeys.sale_starts_at];
    }

    getSaleEnd(): number {
        return this.globalState[globalStateKeys.sale_ends_at];
    }

    getClaimStart(): number {
        return this.globalState[globalStateKeys.claim_after];
    }

    getClaimEnd(): number {
        const claimStart = this.getClaimStart();
        return claimStart + 76800;//add 4 days
    }

    updateStatusDetails(status: F_FundStatus) {
        this.status = status;
    }

    updateAssetDetails(asset: A_Asset) {
        this.asset = asset;
    }

    updateEscrowDetails(escrow: A_AccountInformation) {
        this.escrow = escrow;
    }

    updateCompanyDetails(company: F_CompanyDetails) {
        this.company = company;
    }
}