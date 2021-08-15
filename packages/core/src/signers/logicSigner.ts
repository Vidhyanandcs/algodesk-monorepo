import {Signer} from "../types";
import * as sdk from "algosdk";

export class LogicSigner implements Signer{

    constructor() {

    }

    async signTxnByLogic(unsignedTxn, logic: string): Promise<Uint8Array> {
        const logicSig = sdk.makeLogicSig(new Uint8Array(Buffer.from(logic, "base64")));
        return sdk.signLogicSigTransactionObject(unsignedTxn, logicSig).blob;
    }
}
