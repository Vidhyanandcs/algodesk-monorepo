import * as betanetApprovalJson from './betanet/v1/fund/bytes/approval.json';
import * as betanetClearJson from './betanet/v1/fund/bytes/clear.json';
import * as testnetApprovalJson from './betanet/v1/fund/bytes/approval.json';
import * as testnetClearJson from './betanet/v1/fund/bytes/clear.json';
import {NETWORKS} from "@algodesk/core";

export function getContracts(network) {
    if (network === NETWORKS.BETANET) {
        return {
            compiledApprovalProgram: betanetApprovalJson,
            compiledClearProgram: betanetClearJson
        }
    }
    if (network === NETWORKS.TESTNET) {
        return {
            compiledApprovalProgram: testnetApprovalJson,
            compiledClearProgram: testnetClearJson
        }
    }
}