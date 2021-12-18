import {A_SearchTransaction} from "@algodesk/core";

export interface F_DeployFund {
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

export type F_FundStatus = {
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