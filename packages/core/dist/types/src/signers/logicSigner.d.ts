import { Signer } from "./signer";
export declare class LogicSigner extends Signer {
    constructor();
    signTxnByLogic(unsignedTxn: any, logic: string): Promise<Uint8Array>;
}
