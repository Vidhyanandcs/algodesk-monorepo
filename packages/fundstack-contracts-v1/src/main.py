import os
from pyteal import compileTeal, Mode
from contracts.approval import approvalProgram
from contracts.escrow import escrowProgram
from contracts.clear import clearProgram

approvalFile = os.path.join(os.path.dirname(__file__), '..', 'teal', 'approval.teal')
if __name__ == "__main__":
    with open(approvalFile, 'w') as f:
        compiledApprovalProgram = compileTeal(approvalProgram(), mode=Mode.Application, version=4)
        f.write(compiledApprovalProgram)

escrowFile = os.path.join(os.path.dirname(__file__), '..', 'teal', 'escrow.teal')
if __name__ == "__main__":
    with open(escrowFile, 'w') as f:
        compiledEscrowProgram = compileTeal(escrowProgram(), mode=Mode.Signature, version=4)
        f.write(compiledEscrowProgram)

clearFile = os.path.join(os.path.dirname(__file__), '..', 'teal', 'clear.teal')
if __name__ == "__main__":
    with open(clearFile, 'w') as f:
        compiledClearProgram = compileTeal(clearProgram(), mode=Mode.Signature, version=4)
        f.write(compiledClearProgram)