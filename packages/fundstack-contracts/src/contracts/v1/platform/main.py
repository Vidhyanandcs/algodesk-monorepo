import os
from pyteal import compileTeal, Mode
from src.contracts.v1.platform.approval import approvalProgram
from src.contracts.v1.platform.clear import clearProgram

def compileContracts(network):
    approvalFile = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'contracts', network, 'v1', 'platform', 'teal', 'approval.teal')
    if __name__ == "__main__":
        with open(approvalFile, 'w') as f:
            compiledApprovalProgram = compileTeal(approvalProgram(), mode=Mode.Application, version=5)
            f.write(compiledApprovalProgram)

    clearFile = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'contracts', network, 'v1', 'platform', 'teal', 'clear.teal')
    if __name__ == "__main__":
        with open(clearFile, 'w') as f:
            compiledClearProgram = compileTeal(clearProgram(), mode=Mode.Signature, version=5)
            f.write(compiledClearProgram)


# compileContracts('betanet')
compileContracts('testnet')