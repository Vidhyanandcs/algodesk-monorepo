import { BaseSigner } from "./baseSigner";
export declare class LogicSigner extends BaseSigner {
    constructor();
    signTxnByLogic(unsignedTxn: any, logic: string): Promise<Uint8Array>;
}
