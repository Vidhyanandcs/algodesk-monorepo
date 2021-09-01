import { Algodv2 } from "algosdk";
import IndexerClient from "algosdk/dist/types/src/client/v2/indexer/indexer";
import { A_AccountInformation, Signer, A_Asset, A_AssetHolding, A_Application, A_AppsLocalState } from "../types";
import { TransactionClient } from "./transactionClient";
export declare class AccountClient {
    client: Algodv2;
    indexer: IndexerClient;
    signer: Signer;
    transactionClient: TransactionClient;
    constructor(client: Algodv2, indexer: IndexerClient, signer: Signer);
    getAccountInformation(address: string): Promise<A_AccountInformation>;
    getCreatedAssets(accountInfo: A_AccountInformation): A_Asset[];
    getHoldingAssets(accountInfo: A_AccountInformation): A_AssetHolding[];
    getCreatedApps(accountInfo: A_AccountInformation): A_Application[];
    getOptedApps(accountInfo: A_AccountInformation): A_AppsLocalState[];
    getHoldingAsset(assetId: number, accountInfo: A_AccountInformation): A_AssetHolding;
    getCreatedAsset(assetId: number, accountInfo: A_AccountInformation): A_Asset;
    balanceOf(assetId: number, accountInfo: A_AccountInformation): number;
    canManage(address: string, asset: A_Asset): boolean;
    canFreeze(address: string, asset: A_Asset): boolean;
    canClawback(address: string, asset: A_Asset): boolean;
}
