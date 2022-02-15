import path from 'path';
import nodeWindowPolyfill from "node-window-polyfill";
nodeWindowPolyfill.register();
import {NETWORKS} from "@algodesk/core";
import {compile} from "./utils";

export async function compilePoolContracts(network: string) {
    const poolApprovalTealPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'pool', 'teal', 'approval.teal');
    const poolApprovalBytesPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'pool', 'bytes', 'approval.json');
    await compile(poolApprovalTealPath, poolApprovalBytesPath, network);

    const poolClearTealPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'pool', 'teal', 'clear.teal');
    const poolClearBytesPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'pool', 'bytes', 'clear.json');
    await compile(poolClearTealPath, poolClearBytesPath, network);
}

async function compilePoolContractsForNetworks() {
    await compilePoolContracts(NETWORKS.BETANET);
    await compilePoolContracts(NETWORKS.TESTNET);
}

compilePoolContractsForNetworks();
