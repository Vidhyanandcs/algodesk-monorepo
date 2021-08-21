import { Explorer } from "./explorer";
export declare const testnetExplorer: Explorer;
export declare const betanetExplorer: Explorer;
export declare const mainnetExplorer: Explorer;
export declare function getExplorer(name: string): Explorer;
export declare function getExplorers(): Explorer[];
