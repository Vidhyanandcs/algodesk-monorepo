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