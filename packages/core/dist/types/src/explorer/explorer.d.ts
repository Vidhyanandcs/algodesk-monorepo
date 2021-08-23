export declare class Explorer {
    url: string;
    constructor(url: string);
    getAccountUrl(address: string): string;
    getAssetUrl(assetId: number): string;
}
