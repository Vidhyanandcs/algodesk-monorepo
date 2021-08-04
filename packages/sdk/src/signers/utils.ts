import {SIGNERS} from "../constants";
import {BaseSigner} from "./baseSigner";
import {WalletSigner} from "./walletSigner";
import {BrowserAlgoSigner} from "./algoSigner";
import {LogicSigner} from "./logicSigner";

export function getSigner(name: string): BaseSigner{
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