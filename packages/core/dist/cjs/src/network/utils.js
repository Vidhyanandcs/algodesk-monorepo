"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetwork = exports.mainnet = exports.betanet = exports.testnet = void 0;
const network_1 = require("./network");
const constants_1 = require("../constants");
exports.testnet = new network_1.Network('testnet', 'TestNet', 'https://testnet.algoexplorer.io', 'https://api.testnet.algoexplorer.io', 'https://api.testnet.algoexplorer.io/idx2');
exports.betanet = new network_1.Network('betanet', 'BetaNet', 'https://betanet.algoexplorer.io', 'https://api.betanet.algoexplorer.io', 'https://api.betanet.algoexplorer.io/idx2');
exports.mainnet = new network_1.Network('mainnet', 'MainNet', 'https://algoexplorer.io', 'https://api.algoexplorer.io', 'https://api.algoexplorer.io/idx2');
function getNetwork(name) {
    if (name == constants_1.NETWORKS.TESTNET) {
        return exports.testnet;
    }
    else if (name == constants_1.NETWORKS.BETANET) {
        return exports.betanet;
    }
    return exports.mainnet;
}
exports.getNetwork = getNetwork;
//# sourceMappingURL=utils.js.map