import * as approvalJson from './v1/fund/bytes/approval.json';
import * as clearJson from './v1/fund/bytes/clear.json';

export function getContracts() {
    return {
        compiledApprovalProgram: approvalJson,
        compiledClearProgram: clearJson
    }
}