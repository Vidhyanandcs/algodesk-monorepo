import path from 'path';
import nodeWindowPolyfill from "node-window-polyfill";
nodeWindowPolyfill.register();
import {NETWORKS} from "@algodesk/core";
import {compile} from "./utils";

export async function compilePlatformContracts(network: string) {
    const platformApprovalTealPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'platform', 'teal', 'approval.teal');
    const platformApprovalBytesPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'platform', 'bytes', 'approval.json');
    await compile(platformApprovalTealPath, platformApprovalBytesPath, network);

    const platformClearTealPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'platform', 'teal', 'clear.teal');
    const platformClearBytesPath = path.join(__dirname, '..', '..','..', 'contracts', network, 'v1', 'platform', 'bytes', 'clear.json');
    await compile(platformClearTealPath, platformClearBytesPath, network);
}

async function compilePlatformContractsForNetworks() {
    await compilePlatformContracts(NETWORKS.BETANET);
    await compilePlatformContracts(NETWORKS.TESTNET);
}

compilePlatformContractsForNetworks();
