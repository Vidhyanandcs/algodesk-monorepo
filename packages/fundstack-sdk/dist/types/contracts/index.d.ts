import * as escrowTeal from './teal/escrow.teal';
export declare function getContracts(): {
    compiledApprovalProgram: {
        hash: string;
        result: string;
    };
    compiledClearProgram: {
        hash: string;
        result: string;
    };
    escrowProgram: {
        teal: typeof escrowTeal;
    };
};
