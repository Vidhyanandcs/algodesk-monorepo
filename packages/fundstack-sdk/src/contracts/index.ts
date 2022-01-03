import * as betanetApprovalJson from './betanet/v1/fund/bytes/approval.json';
import * as betanetClearJson from './betanet/v1/fund/bytes/clear.json';
import {NETWORKS} from "@algodesk/core";

export function getContracts(network) {
    if (network === NETWORKS.BETANET) {
        return {
            compiledApprovalProgram: betanetApprovalJson,
            compiledClearProgram: betanetClearJson
        }
    }
}