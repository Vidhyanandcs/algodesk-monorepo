import { Signer } from "./signer";
import * as sdk from "algosdk";
export class LogicSigner extends Signer {
    constructor() {
        super();
    }
    async signTxnByLogic(unsignedTxn, logic) {
        const logicSig = sdk.makeLogicSig(new Uint8Array(Buffer.from(logic, "base64")));
        return sdk.signLogicSigTransactionObject(unsignedTxn, logicSig).blob;
    }
}
//# sourceMappingURL=logicSigner.js.map