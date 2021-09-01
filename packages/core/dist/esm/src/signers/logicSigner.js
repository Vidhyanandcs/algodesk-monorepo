import * as sdk from "algosdk";
import { NETWORKS } from "../constants";
export class LogicSigner {
    constructor() {
        this.supportedNetworks = [NETWORKS.BETANET, NETWORKS.TESTNET, NETWORKS.MAINNET];
    }
    async signTxnByLogic(unsignedTxn, logic) {
        const logicSig = sdk.makeLogicSig(new Uint8Array(Buffer.from(logic, "base64")));
        return sdk.signLogicSigTransactionObject(unsignedTxn, logicSig).blob;
    }
    isInstalled() {
        return true;
    }
    logout() {
    }
}
//# sourceMappingURL=logicSigner.js.map