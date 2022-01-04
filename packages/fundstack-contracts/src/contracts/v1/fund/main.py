import os
from pyteal import compileTeal, Mode, Int
from src.contracts.v1.fund.approval import approvalProgram
from src.contracts.v1.fund.clear import clearProgram

approvalFile = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'contracts', 'betanet', 'v1', 'fund', 'teal', 'approval.teal')
if __name__ == "__main__":
    with open(approvalFile, 'w') as f:
        compiledApprovalProgram = compileTeal(approvalProgram(Int(438565946)), mode=Mode.Application, version=5)
        f.write(compiledApprovalProgram)

clearFile = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'contracts', 'betanet', 'v1', 'fund', 'teal', 'clear.teal')
if __name__ == "__main__":
    with open(clearFile, 'w') as f:
        compiledClearProgram = compileTeal(clearProgram(), mode=Mode.Signature, version=5)
        f.write(compiledClearProgram)