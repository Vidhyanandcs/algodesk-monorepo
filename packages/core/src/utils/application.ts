import {encode} from "hi-base32";

export function processApplicationArgs(appArgs): Uint8Array[] {
    if (!appArgs) {
        appArgs = [];
    }

    const appArgsUint: Uint8Array[] = [];

    appArgs.forEach((arg) => {
        appArgsUint.push(new Uint8Array(Buffer.from(arg)));
    });

    return appArgsUint;
}

export function getUintProgram(compiledProgramResult: string): Uint8Array {
    return  new Uint8Array(Buffer.from(compiledProgramResult, "base64"));
}

export function encodeTxId(hash: any): string {
    return encode(hash).slice(0, 52);
}