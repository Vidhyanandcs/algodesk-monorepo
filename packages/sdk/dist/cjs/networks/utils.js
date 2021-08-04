"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNetwork = void 0;
const testNet_1 = require("./testNet");
const constants_1 = require("../constants");
const betaNet_1 = require("./betaNet");
const mainNet_1 = require("./mainNet");
function getNetwork(name) {
    if (name == constants_1.NETWORKS.TESTNET) {
        return new testNet_1.TestNet();
    }
    else if (name == constants_1.NETWORKS.BETANET) {
        return new betaNet_1.BetaNet();
    }
    return new mainNet_1.MainNet();
}
exports.getNetwork = getNetwork;
//# sourceMappingURL=utils.js.map