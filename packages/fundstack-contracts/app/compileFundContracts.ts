import path from 'path';
import nodeWindowPolyfill from "node-window-polyfill";
nodeWindowPolyfill.register();
import {NETWORKS} from "@algodesk/core";
import {compile} from "./utils";

export async function compileFundContracts(network: string) {
    const fundApprovalTealPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'fund', 'teal', 'approval.teal');
    const fundApprovalBytesPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'fund', 'bytes', 'approval.json');
    await compile(fundApprovalTealPath, fundApprovalBytesPath, network);

    const fundClearTealPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'fund', 'teal', 'clear.teal');
    const fundClearBytesPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'fund', 'bytes', 'clear.json');
    await compile(fundClearTealPath, fundClearBytesPath, network);
}

async function compileFundContractsForNetworks() {
    await compileFundContracts(NETWORKS.BETANET);
    await compileFundContracts(NETWORKS.TESTNET);
}

compileFundContractsForNetworks();
