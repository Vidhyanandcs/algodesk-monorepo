import { Signer } from "../types";
export declare function getSigner(name: string): Signer;
export interface SupportedSigner {
    name: string;
    label: string;
    logo: string;
    instance: Signer;
}
export declare function getSupportedSigners(): SupportedSigner[];
