import { SIGNERS } from "../constants";
import { WalletSigner } from "./walletSigner";
import { BrowserAlgoSigner } from "./algoSigner";
import { LogicSigner } from "./logicSigner";
export function getSigner(name) {
    if (name == SIGNERS.WALLET) {
        return new WalletSigner();
    }
    else if (name == SIGNERS.ALGO_SIGNER) {
        return new BrowserAlgoSigner();
    }
    else if (name == SIGNERS.LOGIC_SIG) {
        return new LogicSigner();
    }
    return new BrowserAlgoSigner();
}
//# sourceMappingURL=utils.js.map