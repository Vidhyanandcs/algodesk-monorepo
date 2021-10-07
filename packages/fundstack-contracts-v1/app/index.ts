import readFile from 'read-file';
import path from 'path';
import write from 'write';
import nodeWindowPolyfill from "node-window-polyfill";

nodeWindowPolyfill.register();
import {WalletSigner, Algodesk, betanet} from "@algodesk/core";

export async function compile(programTealPath: string, programBytesPath: string) {
    console.log('******************************************');
    console.log(programTealPath);
    console.log(programBytesPath);

    const walletSigner = new WalletSigner();
    const algodesk = new Algodesk(betanet, walletSigner);

    const programSource = readFile.sync(programTealPath);
    const compiled = await algodesk.applicationClient.compileProgram(programSource);
    write.sync(programBytesPath, JSON.stringify(compiled), { newline: true });
    
    console.log(compiled);
    console.log('******************************************');
}

const fundApprovalTeal = path.join(__dirname, '..', '..', 'contracts', 'v1', 'fund', 'teal', 'approval.teal');
const fundApprovalBytes = path.join(__dirname, '..', '..', 'contracts', 'v1', 'fund', 'bytes', 'approval.json');
compile(fundApprovalTeal, fundApprovalBytes);

const fundClearTeal = path.join(__dirname, '..', '..', 'contracts', 'v1', 'fund', 'teal', 'clear.teal');
const fundClearBytes = path.join(__dirname, '..', '..', 'contracts', 'v1', 'fund', 'bytes', 'clear.json');
compile(fundClearTeal, fundClearBytes);

const revenueApprovalTeal = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'teal', 'approval.teal');
const revenueApprovalBytes = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'bytes', 'approval.json');
compile(revenueApprovalTeal, revenueApprovalBytes);

const revenueClearTeal = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'teal', 'clear.teal');
const revenueClearBytes = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'bytes', 'clear.json');
compile(revenueClearTeal, revenueClearBytes);