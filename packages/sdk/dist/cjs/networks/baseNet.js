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
exports.BaseNet = void 0;
const sdk = __importStar(require("algosdk"));
class BaseNet {
    constructor() {
        this.algodToken = {};
        this.indexerToken = {};
        this.algodClient = new sdk.Algodv2(this.algodToken, this.algod, this.port);
        this.indexerClient = new sdk.Indexer(this.indexerToken, this.indexer, this.port);
    }
    getLabel() {
        return this.label;
    }
    getClient() {
        return this.algodClient;
    }
    getIndexer() {
        return this.indexerClient;
    }
}
exports.BaseNet = BaseNet;
//# sourceMappingURL=baseNet.js.map