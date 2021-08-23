import algosdk from "./algosdk";
import {formatNumber} from 'accounting';

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

export function getAmountInDecimals(amount: number, decimals: number) {
    return formatNumber(amount, {
        precision: decimals
    });
}
