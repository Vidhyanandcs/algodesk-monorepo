export interface A_StateSchema {
    "num-byte-slice": number
    "num-uint": number
}

export type A_SearchTransactionInner = Omit<A_SearchTransaction, "id,note,genesis-hash,genesis-id,inner-txns">

export interface A_SearchTransactions {
    "current-round": number,
    "next-token": string,
    transactions: [A_SearchTransaction]
}

export interface A_SearchTransaction{
    "close-rewards": number
    "closing-amount": number
    "confirmed-round": number
    fee: number
    "first-valid": number
    "intra-round-offset": number
    "last-valid": number
    "receiver-rewards": number
    "round-time": number
    sender: string
    "sender-rewards": number
    "tx-type": string,
    note: string
    "genesis-hash": string
    "genesis-id": string
    id: string
    "inner-txns": [A_SearchTransactionInner]
    "created-application-index"?: number
    "application-transaction"?: {
        accounts: string[]
        "application-args": string[]
        "application-id": number
        "approval-program": string
        "clear-state-program": string
        "foreign-apps": number[]
        "foreign-assets": number[]
        "global-state-schema": A_StateSchema
        "local-state-schema": A_StateSchema
        "on-completion": string
    }
    "asset-transfer-transaction"?: {
        amount: number
        "asset-id": number
        "close-amount": number
        receiver: string
    }
}

export interface A_Application {
    id: number
    params: A_ApplicationParams
}

export interface A_ApplicationParams {
    "approval-program": string
    "clear-state-program": string
    creator: string
    "global-state"?: A_GlobalState[]
    "global-state-schema": A_StateSchema
    "local-state-schema": A_StateSchema
}

export interface A_GlobalState {
    key: string
    value: {
        bytes: string
        type: number
        uint: number
    }
}

export interface A_StateSchema {
    "num-byte-slice": number
    "num-uint": number
}

export type F_FundGlobalState = {
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
    fc: number
    cd: string
    tr: number
    fw: number
    rac: number
    pai: number
    pe: string
    psf: number
    ppf: number
    pfemtu: number
    pscp: number
}

export interface A_Asset {
    index: number
    params: A_AssetParams
}

export interface A_AssetParams {
    clawback?: string
    creator: string
    decimals: number
    "default-frozen": boolean
    freeze?: string
    manager?: string
    name: string
    "name-b64": string
    reserve?: string
    total: number
    "unit-name": string
    "unit-name-b64": string
    url?: string
    "url-b64"?: string
    "metadata-hash"?: string
}