import { Signer } from "../types";
export declare class LogicSigner implements Signer {
    private supportedNetworks;
    constructor();
    signTxnByLogic(unsignedTxn: any, logic: string): Promise<Uint8Array>;
    isInstalled(): boolean;
    logout(): void;
}
