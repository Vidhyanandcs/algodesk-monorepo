import {A_SearchTransaction, durationBetweenBlocks} from "@algodesk/core";
import Duration from 'duration';

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
    start: Duration,
    end: Duration,
    pending: boolean,
    active: boolean,
    completed: boolean
}

export type F_FundStatus = {
    registration: F_PhaseDetails,
    sale: F_PhaseDetails,
    claim: F_PhaseDetails,
    withdraw: F_PhaseDetails,
    phase: number,
    date: number,
    targetReached: boolean,
    published: boolean,
    valid: boolean
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