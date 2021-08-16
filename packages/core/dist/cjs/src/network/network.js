"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
const sdk = __importStar(require("algosdk"));
class Network {
    constructor(name, label, explorer, algod, indexer, algodToken = {}, indexerToken = {}, port = '') {
        this.name = name;
        this.label = label;
        this.explorer = explorer;
        this.port = port;
        this.setAlgodServer(algod, algodToken);
        this.setIndexerServer(indexer, indexerToken);
    }
    setAlgodServer(url, algodToken = {}) {
        this.algod = url;
        this.algodToken = algodToken;
    }
    setIndexerServer(url, indexerToken = {}) {
        this.indexer = url;
        this.indexerToken = indexerToken;
    }
    getClient() {
        return new sdk.Algodv2(this.algodToken, this.algod, this.port);
    }
    getIndexer() {
        return new sdk.Indexer(this.indexerToken, this.indexer, this.port);
    }
}
exports.Network = Network;
//# sourceMappingURL=network.js.map