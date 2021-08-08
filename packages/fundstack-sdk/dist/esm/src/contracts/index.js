import * as approvalJson from './teal/compiled/approval.json';
import * as clearJson from './teal/compiled/clear.json';
// import * as escrowTeal from './teal/escrow.teal';
export function getContracts() {
    return {
        compiledApprovalProgram: approvalJson,
        compiledClearProgram: clearJson,
        // escrowProgram: {
        //     teal: escrowTeal
        // }
    };
}
//# sourceMappingURL=index.js.map