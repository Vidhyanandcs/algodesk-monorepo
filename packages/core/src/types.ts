import {AssetDestroyTxn, AssetFreezeTxn, AssetTransferTxn, Transaction} from "algosdk";
import { AssetParams } from "algosdk/dist/types/src/client/v2/algod/models/types";
import {RenameProperties} from "algosdk/dist/types/src/types/utils";
import {AssetConfigTxn, MustHaveSuggestedParams} from "algosdk/dist/types/src/types/transactions";

export interface Signer {
    signTxn?(unsignedTxn: Transaction): Uint8Array | Promise<Uint8Array>;
    signGroupTxns?(unsignedTxns: Transaction[]): Uint8Array[] | Promise<Uint8Array[]>;
    signTxnByLogic?(unsignedTxn, logic: string): Promise<Uint8Array>;
}

export type T_SendTxnResponse = {
    txId: string
}

export type T_PendingTransactionResponse = {
    'confirmed-round': number
    "asset-index": number
    'application-index': number,
    txn: {
        sig: Uint8Array
    }
}

// export interface T_CreateAssetParams extends Omit<AssetParams, "attribute_map, get_obj_for_encoding"> {
//     decimals: number
// }

export type T_CreateAssetParams = Omit<AssetParams, 'decimals' | 'attribute_map' | 'get_obj_for_encoding'> & {
    decimals: number
};

export type T_ModifyAssetParams = Pick<RenameProperties<MustHaveSuggestedParams<AssetConfigTxn>, {
    reKeyTo: 'rekeyTo';
    assetManager: 'manager';
    assetReserve: 'reserve';
    assetFreeze: 'freeze';
    assetClawback: 'clawback';
}>, 'from' | 'note' | 'assetIndex' | 'manager' | 'reserve' | 'freeze' | 'clawback'> & {
    strictEmptyAddressChecking: boolean;
}

export type T_FreezeAssetParams = {
    from: string,
    assetIndex: number,
    freezeAccount: string,
    freezeState: boolean
};
