import {OnApplicationComplete, Transaction} from "algosdk";

export interface SignerAccount {
    address: string,
    name: string
}

export interface Signer {
    signTxn?(unsignedTxn: Transaction): Uint8Array | Promise<Uint8Array>;
    signGroupTxns?(unsignedTxns: Transaction[]): Uint8Array[] | Promise<Uint8Array[]>;
    signTxnByLogic?(unsignedTxn, logic: string): Promise<Uint8Array>;
    isInstalled(): boolean;
    connect?(name: string): Promise<SignerAccount[]>,
    isNetworkSupported?(name: string): boolean,
    logout(): void
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

export type A_RevokeAssetParams = {
    from: string,
    assetIndex: number,
    revokeTarget: string,
    revokeReceiver: string,
    amount: number
};

export type A_TransferAssetParams = {
    from: string,
    to: string,
    assetId: number,
    amount: number,
    closeRemainderTo?: string,
    revocationTarget?: string,
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

export interface A_CreateApplicationParams {
    from: string
    approvalProgram: Uint8Array
    clearProgram: Uint8Array
    localInts: number
    localBytes: number
    globalInts: number
    globalBytes: number
    onComplete: OnApplicationComplete
    appArgs?: any[]
    foreignAccounts?: string[]
    foreignApps?: number[]
    foreignAssets?: number[]
}

export interface A_UpdateApplicationParams {
    appId: number
    from: string
    approvalProgram: Uint8Array
    clearProgram: Uint8Array
    appArgs?: any[]
    foreignAccounts?: string[]
    foreignApps?: number[]
    foreignAssets?: number[]
    rekeyTo?: string
    lease?: Uint8Array
}

export interface A_InvokeApplicationParams {
    from: string
    appId: number
    appArgs?: any[]
    foreignAccounts?: string[]
    foreignApps?: number[]
    foreignAssets?: number[]
}

export interface A_OptInApplicationParams {
    from: string
    appId: number
    appArgs?: any[]
    foreignAccounts?: string[]
    foreignApps?: number[]
    foreignAssets?: number[]
}

export interface A_DeleteApplicationParams {
    from: string
    appId: number
    appArgs?: any[]
    foreignAccounts?: string[]
    foreignApps?: number[]
    foreignAssets?: number[]
    lease?: Uint8Array,
    rekeyTo?: string
}

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

export type A_SearchTransactionInner = Omit<A_SearchTransaction, "id,note,genesis-hash,genesis-id,inner-txns">

export type A_CompileProgram = {
    hash: string,
    result: string
}

export type A_BurnerVault = {
    accountInfo: A_AccountInformation,
    active: boolean,
    compiled: A_CompileProgram
}

export interface A_Nft_Attribute {
    trait_type: string;
    value: string;
}

export interface A_Nft_MetaData {
    description: string;
    external_url: string;
    media_url: string;
    attributes?: A_Nft_Attribute[];
    standard: string,
    file_url: string
}

export interface A_Nft {
    asset: A_Asset,
    metadata: A_Nft_MetaData
}