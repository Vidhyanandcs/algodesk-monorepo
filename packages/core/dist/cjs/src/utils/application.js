"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTxId = exports.getUintProgram = exports.processApplicationArgs = void 0;
const hi_base32_1 = require("hi-base32");
function processApplicationArgs(appArgs) {
    if (!appArgs) {
        appArgs = [];
    }
    const appArgsUint = [];
    appArgs.forEach((arg) => {
        appArgsUint.push(new Uint8Array(Buffer.from(arg)));
    });
    return appArgsUint;
}
exports.processApplicationArgs = processApplicationArgs;
function getUintProgram(compiledProgramResult) {
    return new Uint8Array(Buffer.from(compiledProgramResult, "base64"));
}
exports.getUintProgram = getUintProgram;
function encodeTxId(hash) {
    return hi_base32_1.encode(hash).slice(0, 52);
}
exports.encodeTxId = encodeTxId;
//# sourceMappingURL=application.js.map