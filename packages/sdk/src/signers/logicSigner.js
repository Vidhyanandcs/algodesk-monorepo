import {BaseSigner} from "./baseSigner";
import * as sdk from "algosdk";

export class LogicSigner extends BaseSigner{
    constructor() {
        super();
    }

    signTxn(logic, unsignedTxn) {
        const logicSig = sdk.makeLogicSig(new Uint8Array(Buffer.from(logic, "base64")));
        const rawSignedTxn = sdk.signLogicSigTransactionObject(unsignedTxn, logicSig).blob;
        return rawSignedTxn;
    }
}
