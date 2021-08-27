import algosdk from "./algosdk";
import {formatNumber} from 'accounting';
import {A_AccountInformation, A_Asset} from "@algodesk/core";

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

export function getNumberInputValue(value: string): number {
    if (isNumber(value)) {
        return parseInt(value);
    }
    else {
        if (!value) {
            return 0;
        }
    }
}
