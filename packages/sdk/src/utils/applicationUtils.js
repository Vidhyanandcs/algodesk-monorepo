import {prepareNote} from "./coreUtils";

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

export function processApplicationForeignAccounts(foreignAccounts) {
    if (!foreignAccounts) {
        foreignAccounts = [];
    }

    return foreignAccounts;
}

export function processApplicationForeignApps(foreignApps) {
    if (!foreignApps) {
        foreignApps = [];
    }

    const foreignAppsNumber = [];

    foreignApps.forEach((arg) => {
        foreignAppsNumber.push(parseInt(arg));
    });

    return foreignAppsNumber;
}

export function processApplicationForeignAssets(foreignAssets) {
    if (!foreignAssets) {
        foreignAssets = [];
    }

    const foreignAssetsNumber = [];

    foreignAssets.forEach((arg) => {
        foreignAssetsNumber.push(parseInt(arg));
    });

    return foreignAssetsNumber;
}

export function processApplicationInputs(appArgs = [], foreignAccounts = [], foreignApps = [], foreignAssets = [], note = "") {
    return {
        appArgs: processApplicationArgs(appArgs),
        foreignAccounts: processApplicationForeignAccounts(foreignAccounts),
        foreignApps: processApplicationForeignApps(foreignApps),
        foreignAssets: processApplicationForeignAssets(foreignAssets),
        note: prepareNote(note)
    };
}

export function getUintProgram(compiledProgramResult) {
    const uintProgram = new Uint8Array(Buffer.from(compiledProgramResult, "base64"));
    return uintProgram;
}