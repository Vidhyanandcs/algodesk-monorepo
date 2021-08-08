import { encode } from "hi-base32";
export function processApplicationArgs(appArgs) {
    if (!appArgs) {
        appArgs = [];
    }
    const appArgsUint = [];
    appArgs.forEach((arg) => {
        appArgsUint.push(new Uint8Array(Buffer.from(arg)));
    });
    return appArgsUint;
}
export function getUintProgram(compiledProgramResult) {
    return new Uint8Array(Buffer.from(compiledProgramResult, "base64"));
}
export function encodeTxId(hash) {
    return encode(hash).slice(0, 52);
}
//# sourceMappingURL=application.js.map