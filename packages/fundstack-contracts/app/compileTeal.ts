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

const platformApprovalTealPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'platform', 'teal', 'approval.teal');
const platformApprovalBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'platform', 'bytes', 'approval.json');
compile(platformApprovalTealPath, platformApprovalBytesPath);

const platformClearTealPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'platform', 'teal', 'clear.teal');
const platformClearBytesPath = path.join(__dirname, '..', '..', 'contracts', 'v1', 'platform', 'bytes', 'clear.json');
compile(platformClearTealPath, platformClearBytesPath);