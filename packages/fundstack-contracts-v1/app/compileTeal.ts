import readFile from 'read-file';
import path from 'path';
import write from 'write';
import nodeWindowPolyfill from "node-window-polyfill";
nodeWindowPolyfill.register();
import {Algodesk, betanet} from "@algodesk/core";

export async function compile(programTealPath: string, programBytesPath: string) {
    console.log('******************************************');
    console.log(programTealPath);
    console.log(programBytesPath);

    const algodesk = new Algodesk(betanet);

    const programSource = readFile.sync(programTealPath);
    const compiled = await algodesk.applicationClient.compileProgram(programSource);
    write.sync(programBytesPath, JSON.stringify(compiled), { newline: true });
    
    console.log(compiled);
    console.log('******************************************');
}

const fundApprovalTealPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'fund', 'teal', 'approval.teal');
const fundApprovalBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'fund', 'bytes', 'approval.json');
compile(fundApprovalTealPath, fundApprovalBytesPath);

const fundClearTealPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'fund', 'teal', 'clear.teal');
const fundClearBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'fund', 'bytes', 'clear.json');
compile(fundClearTealPath, fundClearBytesPath);

const revenueApprovalTealPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'teal', 'approval.teal');
const revenueApprovalBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'bytes', 'approval.json');
compile(revenueApprovalTealPath, revenueApprovalBytesPath);

const revenueClearTealPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'teal', 'clear.teal');
const revenueClearBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'revenue', 'bytes', 'clear.json');
compile(revenueClearTealPath, revenueClearBytesPath);