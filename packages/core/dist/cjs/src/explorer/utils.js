"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorers = exports.getExplorer = exports.mainnetExplorer = exports.betanetExplorer = exports.testnetExplorer = void 0;
const explorer_1 = require("./explorer");
const constants_1 = require("../constants");
exports.testnetExplorer = new explorer_1.Explorer("https://testnet.algoexplorer.io");
exports.betanetExplorer = new explorer_1.Explorer("https://betanet.algoexplorer.io");
exports.mainnetExplorer = new explorer_1.Explorer("https://algoexplorer.io");
function getExplorer(name) {
    if (name == constants_1.NETWORKS.TESTNET) {
        return exports.testnetExplorer;
    }
    else if (name == constants_1.NETWORKS.BETANET) {
        return exports.betanetExplorer;
    }
    return exports.mainnetExplorer;
}
exports.getExplorer = getExplorer;
function getExplorers() {
    return [exports.testnetExplorer, exports.betanetExplorer, exports.mainnetExplorer];
}
exports.getExplorers = getExplorers;
//# sourceMappingURL=utils.js.map