import algosdk from "./algosdk";

export function openAccountInExplorer(address: string = ""): void {
    const url = algosdk.explorer.getAccountUrl(address);
    window.open(url, "_blank");
}
