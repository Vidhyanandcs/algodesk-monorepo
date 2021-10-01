import {durationBetweenBlocks} from "@algodesk/core";
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
    swapRatio: number
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
    phase: number,
    date: number
}

export type F_CompanyDetails =  {
    website: string,
    whitePaper: string,
    twitter: string,
    github: string,
    tokenomics?: string
}