import { BaseClient } from "./baseClient";
import { Transaction } from 'algosdk';
export declare class AssetClient extends BaseClient {
    constructor(name: string, signerName: string);
    get(id: number): Promise<any>;
    prepareTransferTxn(from: string, to: string, closeRemainderTo: string | undefined, revocationTarget: string | undefined, amount: number, note: string, assetId: number, rekeyTo: string | undefined): Promise<Transaction>;
    transfer(from: string, to: string, closeRemainderTo: string | undefined, revocationTarget: string | undefined, amount: number, note: string, assetId: number, rekeyTo: string | undefined): Promise<void>;
}
