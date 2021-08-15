import {Transaction} from "algosdk";


export interface Signer {
    signTxn?(unsignedTxn: Transaction): Uint8Array | Promise<Uint8Array>;
    signGroupTxns?(unsignedTxns: Transaction[]): Uint8Array[] | Promise<Uint8Array[]>;
    signTxnByLogic?(unsignedTxn, logic: string): Promise<Uint8Array>;
}

export type A_SendTxnResponse = {
    txId: string
}

export type A_PendingTransactionResponse = {
    'confirmed-round': number
    "asset-index": number
    'application-index': number,
    txn: {
        sig: Uint8Array
    }
}

export interface A_CreateAssetParams {
    creator: string;
    name: string;
    unitName: string;
    total: number | bigint;
    decimals: number;
    url: string | undefined;
    manager: string | undefined;
    reserve: string | undefined;
    freeze: string | undefined;
    clawback: string | undefined;
    defaultFrozen: boolean;
    metadataHash?: string | Uint8Array;
}

export interface A_ModifyAssetParams {
    from: string;
    assetIndex: number
    manager: string | undefined;
    reserve: string | undefined;
    freeze: string | undefined;
    clawback: string | undefined;
    strictEmptyAddressChecking: boolean;
}

export type A_FreezeAssetParams = {
    from: string,
    assetIndex: number,
    freezeAccount: string,
    freezeState: boolean
};


export interface A_AccountInformation {
    address: string
    amount: number
    "amount-without-pending-rewards": number
    "apps-local-state": A_AppsLocalState[]
    "apps-total-schema": A_AppsTotalSchema
    assets: A_AssetHolding[]
    "created-apps": A_Application[]
    "created-assets": A_Asset[]
    "pending-rewards": number
    "reward-base": number
    rewards: number
    round: number
    status: string
}

export interface A_AppsTotalSchema {
    "num-byte-slice": number
    "num-uint": number
}

export interface A_AssetHolding {
    amount: number
    "asset-id": number
    creator: string
    "is-frozen": boolean
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

export interface A_AppsLocalState {
    id: number
    "key-value": {
        key: string
        value: {
            bytes: string
            type: number
            uint: number
        }
    }[]
    schema: A_StateSchema
}
