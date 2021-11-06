import algosdk from "./algosdk";
import {formatNumber} from 'accounting';
import {A_AccountInformation, A_Asset, NETWORKS} from "@algodesk/core";

export function openAccountInExplorer(address: string = ""): void {
    if (address) {
        const url = algosdk.explorer.getAccountUrl(address);
        window.open(url, "_blank");
    }
}

export function openAssetInExplorer(assetId: number): void {
    if (assetId) {
        const url = algosdk.explorer.getAssetUrl(assetId);
        window.open(url, "_blank");
    }
}

export function openTransactionInExplorer(txId: string): void {
    if (txId) {
        const url = algosdk.explorer.getTransactionUrl(txId);
        window.open(url, "_blank");
    }
}

const networkEnv: string = process.env.REACT_APP_NETWORK;
export function getNetwork(): string {
    let network: string = networkEnv;
    if (!network) {
        network = NETWORKS.MAINNET;
    }
    return network;
}

export function formatNumWithDecimals(num: number, decimals: number): string {
    return formatNumber(num, {
        precision: decimals
    });
}

export function getAssetBal(asset: A_Asset, information: A_AccountInformation): number {
    return algosdk.algodesk.accountClient.balanceOf(asset.index, information) / Math.pow(10, asset.params.decimals);
}

export function getAssetBalWithTicker(asset: A_Asset, information: A_AccountInformation): string {
    return formatNumWithDecimals(getAssetBal(asset, information), asset.params.decimals) + ' ' + asset.params['unit-name'];
}

export function isNumber(n: any) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function isPositive(n: number) {
    return n >= 0;
}

export function debounce (task: any, ms: number) {
    // @ts-ignore
    let t = { promise: null, cancel: _ => void 0 }
    return async (...args: any) => {
        try {
            // @ts-ignore
            t.cancel()
            t = deferred(ms)
            await t.promise
            await task(...args)
        }
        catch (_) { /* prevent memory leak */ }
    }
}

export function deferred (ms: number) {
    let cancel, promise = new Promise((resolve, reject) => {
        cancel = reject
        setTimeout(resolve, ms)
    })
    return { promise, cancel }
}
