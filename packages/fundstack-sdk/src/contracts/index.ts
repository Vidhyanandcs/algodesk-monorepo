import * as approvalJson from './teal/compiled/approval.json';
import * as clearJson from './teal/compiled/clear.json';

export function getContracts() {
    return {
        compiledApprovalProgram: approvalJson,
        compiledClearProgram: clearJson
    }
}