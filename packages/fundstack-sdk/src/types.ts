import {A_SearchTransaction} from "@algodesk/core";

export interface F_CreatePool {
    from: string
    name: string
    assetId: number
    regStartsAt: number
    regEndsAt: number
    saleStartsAt: number,
    saleEndsAt: number,
    totalAllocation: number,
    minAllocation: number,
    maxAllocation: number,
    price: number
}

export type F_PhaseDetails = {
    pending: boolean,
    active: boolean,
    completed: boolean,
    durationMilliSeconds: number,
    durationHumanize: string,
    durationReadable: string
}

export type F_PoolStatus = {
    registration: F_PhaseDetails,
    sale: F_PhaseDetails,
    claim: F_PhaseDetails,
    withdraw: F_PhaseDetails,
    phase: number,
    date: number,
    targetReached: boolean,
    published: boolean
}

export type F_CompanyDetails =  {
    website: string,
    whitePaper: string,
    twitter: string,
    github: string,
    tokenomics?: string
}

export interface F_AccountActivity extends A_SearchTransaction {
    operation: string
    label: string
}

export type F_DB_POOL =  {
    _id: string,
    app_id: number,
    asset_id: number,
    name: string,
    price: number,
    asset_unit: string,
    total_allocation: number,
    active: boolean,
    platform_app_id: number,
    approval_program: string,
    clear_program: string
}