import {Signer} from "./signer";
import * as sdk from "algosdk";
import LogicSig from "algosdk/dist/types/src/logicsig";

export class LogicSigner extends Signer{
    constructor() {
        super();
    }

    async signTxnByLogic(unsignedTxn, logic: string): Promise<Uint8Array> {
        const logicSig: LogicSig = sdk.makeLogicSig(new Uint8Array(Buffer.from(logic, "base64")));
        return sdk.signLogicSigTransactionObject(unsignedTxn, logicSig).blob;
    }
}