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