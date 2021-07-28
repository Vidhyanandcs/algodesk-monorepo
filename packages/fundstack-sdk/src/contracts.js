const approvalJson = require('./remote/contracts/compiled/approval.json');
const clearJson = require('./remote/contracts/compiled/clear.json');
import escrowTeal from './remote/contracts/escrow.teal';

export function getContracts() {
    return {
        compiledApprovalProgram: approvalJson,
        compiledClearProgram: clearJson,
        escrowProgram: {
            teal: escrowTeal
        }
    }
}