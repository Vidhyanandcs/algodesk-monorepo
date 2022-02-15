import {globalStateKeys} from "./state/pool";
import * as sdk from "algosdk";
import {A_AccountInformation, A_Asset, encodeTxId, A_ApplicationParams, A_Application} from "@algodesk/core";
import atob from 'atob';
import {F_CompanyDetails, F_PoolStatus} from "./types";
import {getContracts} from "./contracts";

export type F_PoolLocalState = {
    r: number
    i: number
    ia: number
    c: number
    w: number
};

export type F_PoolGlobalState = {
    v: number
    p: number
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
    ac: number
    cd: string
    tr: number
    aw: number
    rac: number
    pai: number
    pe: string
    psf: number
    prf: number
    ppf: number
    ppemtu: number
    pscp: number
}

export function getPoolState(pool: A_Application): F_PoolGlobalState {
    const gState = pool.params['global-state'];
    const globalState = {};

    gState.forEach((gStateProp) => {
        const key = atob(gStateProp.key);
        const {value} = gStateProp;

        if (value.type == 1) {
            if (key == globalStateKeys.creator || key == globalStateKeys.escrow || key == globalStateKeys.platform_escrow) {
                globalState[key] = sdk.encodeAddress(new Uint8Array(Buffer.from(value.bytes, "base64")));
            }
            else if (key == globalStateKeys.company_details) {
                globalState[key] = encodeTxId(new Uint8Array(Buffer.from(value.bytes, "base64")));
            }
            else {
                globalState[key] = atob(value.bytes);
            }
        }
        else {
            globalState[key] = value.uint;
        }
    });

    return globalState as F_PoolGlobalState;
}

export function getAccountState(localApp): F_PoolLocalState {
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

    return localState as F_PoolLocalState;
}

export class Pool {
    id: number | bigint;
    params: A_ApplicationParams;
    globalState: F_PoolGlobalState;
    status: F_PoolStatus;
    asset: A_Asset;
    escrow: A_AccountInformation;
    company: F_CompanyDetails;
    valid: boolean
    error: {
        message: string
    }
    network: string;

    constructor(pool: A_Application, network: string) {
        this.id = pool.id;
        this.params = pool.params;
        this.network = network;
        this.valid = this.isValid();

        if (this.valid) {
            this.globalState = getPoolState(pool);
        }
        else {
            this.setError('Invalid pool');
        }
    }

    setError(message: string) {
        this.error = {
            message
        };
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

    getPlatformPublishFee(): number {
        return this.globalState[globalStateKeys.platform_publish_fee];
    }

    getPlatformRegistrationFee(): number {
        return this.globalState[globalStateKeys.platform_registration_fee];
    }

    getPoolEscrowMinTopUp(): number {
        return this.globalState[globalStateKeys.platform_pool_escrow_min_top_up];
    }

    getMinAllocation(): number {
        return this.globalState[globalStateKeys.min_allocation];
    }

    getMaxAllocation(): number {
        return this.globalState[globalStateKeys.max_allocation];
    }

    getPrice(): number {
        return this.globalState[globalStateKeys.price];
    }

    updateStatusDetails(status: F_PoolStatus) {
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

    isPublished(): boolean {
        return this.globalState[globalStateKeys.published] === 1;
    }

    isValid(): boolean {
       const {compiledApprovalProgram, compiledClearProgram} = getContracts(this.network);
       const appApprovalProgram = this.params["approval-program"];
       const appClearProgram = this.params["clear-state-program"];
       return compiledApprovalProgram.result === appApprovalProgram && compiledClearProgram.result === appClearProgram;
    }
}