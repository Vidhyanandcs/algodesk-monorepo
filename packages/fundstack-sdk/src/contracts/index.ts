import * as betanetApprovalJson from './betanet/v1/pool/bytes/approval.json';
import * as betanetClearJson from './betanet/v1/pool/bytes/clear.json';
import * as testnetApprovalJson from './testnet/v1/pool/bytes/approval.json';
import * as testnetClearJson from './testnet/v1/pool/bytes/clear.json';
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