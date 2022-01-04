import readFile from 'read-file';
import path from 'path';
import write from 'write';
import nodeWindowPolyfill from "node-window-polyfill";
nodeWindowPolyfill.register();
import {Algodesk, getNetwork, NETWORKS} from "@algodesk/core";


export async function compile(programTealPath: string, programBytesPath: string, network: string) {
    console.log('******************************************');
    console.log(programTealPath);
    console.log(programBytesPath);

    const algodesk = new Algodesk(getNetwork(network));

    const programSource = readFile.sync(programTealPath);
    const compiled = await algodesk.applicationClient.compileProgram(programSource);
    write.sync(programBytesPath, JSON.stringify(compiled), { newline: true });
    
    console.log(compiled);
    console.log('******************************************');
}

export async function compileNetworkContracts(network: string) {
    const fundApprovalTealPath = path.join(__dirname, '..', '..', 'contracts', network, 'v1', 'fund', 'teal', 'approval.teal');
    const fundApprovalBytesPath = path.join(__dirname, '..', '..', 'contracts', network, 'v1', 'fund', 'bytes', 'approval.json');
    await compile(fundApprovalTealPath, fundApprovalBytesPath, network);

    const fundClearTealPath = path.join(__dirname, '..', '..', 'contracts', network, 'v1', 'fund', 'teal', 'clear.teal');
    const fundClearBytesPath = path.join(__dirname, '..', '..', 'contracts', network, 'v1', 'fund', 'bytes', 'clear.json');
    await compile(fundClearTealPath, fundClearBytesPath, network);

    const platformApprovalTealPath = path.join(__dirname, '..', '..', 'contracts', network, 'v1', 'platform', 'teal', 'approval.teal');
    const platformApprovalBytesPath = path.join(__dirname, '..', '..', 'contracts', network, 'v1', 'platform', 'bytes', 'approval.json');
    await compile(platformApprovalTealPath, platformApprovalBytesPath, network);

    const platformClearTealPath = path.join(__dirname, '..', '..', 'contracts', network, 'v1', 'platform', 'teal', 'clear.teal');
    const platformClearBytesPath = path.join(__dirname, '..', '..', 'contracts', network, 'v1', 'platform', 'bytes', 'clear.json');
    await compile(platformClearTealPath, platformClearBytesPath, network);
}

compileNetworkContracts(NETWORKS.BETANET);
