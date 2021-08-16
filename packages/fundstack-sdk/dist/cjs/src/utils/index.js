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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalState = exports.getGlobalState = exports.getFundState = void 0;
const state_1 = require("../state");
const sdk = __importStar(require("algosdk"));
const core_1 = __importDefault(require("@algodesk/core"));
const atob_1 = __importDefault(require("atob"));
function getFundState(fund) {
    const { globalState } = fund;
    return globalState[state_1.globalStateKeys.state];
}
exports.getFundState = getFundState;
function getGlobalState(fund) {
    const gState = fund.params['global-state'];
    const globalState = {};
    gState.forEach((gStateProp) => {
        const key = atob_1.default(gStateProp.key);
        const { value } = gStateProp;
        if (value.type == 1) {
            if (key == state_1.globalStateKeys.creator || key == state_1.globalStateKeys.escrow) {
                globalState[key] = sdk.encodeAddress(new Uint8Array(Buffer.from(value.bytes, "base64")));
            }
            else if (key == state_1.globalStateKeys.company_details) {
                globalState[key] = core_1.default.encodeTxId(new Uint8Array(Buffer.from(value.bytes, "base64")));
            }
            else {
                globalState[key] = atob_1.default(value.bytes);
            }
        }
        else {
            globalState[key] = value.uint;
        }
    });
    return globalState;
}
exports.getGlobalState = getGlobalState;
function getLocalState(localApp) {
    const lState = localApp['key-value'];
    const localState = {};
    lState.forEach((lStateProp) => {
        const key = atob_1.default(lStateProp.key);
        const { value } = lStateProp;
        if (value.type == 1) {
            localState[key] = atob_1.default(value.bytes);
        }
        else {
            localState[key] = value.uint;
        }
    });
    return localState;
}
exports.getLocalState = getLocalState;
//# sourceMappingURL=index.js.map