import { Signer } from "../types";
export declare class LogicSigner implements Signer {
    constructor();
    signTxnByLogic(unsignedTxn: any, logic: string): Promise<Uint8Array>;
}
