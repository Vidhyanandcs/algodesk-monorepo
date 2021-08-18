import { Network } from "./network";
export declare const testnet: Network;
export declare const betanet: Network;
export declare const mainnet: Network;
export declare function getNetwork(name: string): Network;
export declare function getNetworks(): Network[];
