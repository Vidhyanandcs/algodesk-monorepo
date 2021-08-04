"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSigner = void 0;
const constants_1 = require("../constants");
const walletSigner_1 = require("./walletSigner");
const algoSigner_1 = require("./algoSigner");
const logicSigner_1 = require("./logicSigner");
function getSigner(name) {
    if (name == constants_1.SIGNERS.WALLET) {
        return new walletSigner_1.WalletSigner();
    }
    else if (name == constants_1.SIGNERS.ALGO_SIGNER) {
        return new algoSigner_1.BrowserAlgoSigner();
    }
    else if (name == constants_1.SIGNERS.LOGIC_SIG) {
        return new logicSigner_1.LogicSigner();
    }
    return new algoSigner_1.BrowserAlgoSigner();
}
exports.getSigner = getSigner;
//# sourceMappingURL=utils.js.map