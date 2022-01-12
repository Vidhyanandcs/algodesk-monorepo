import os
from pyteal import compileTeal, Mode, Int
from src.contracts.v1.fund.approval import approvalProgram
from src.contracts.v1.fund.clear import clearProgram
from pathlib import Path

base_path = Path(__file__).parent
file_path = (base_path / "../platform/apps.json").resolve()
import json


f = open(file_path)
apps = json.loads(f.read())

def compileContracts(network, platformAppId):
    approvalFile = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'contracts', network, 'v1', 'fund', 'teal', 'approval.teal')
    if __name__ == "__main__":
        with open(approvalFile, 'w') as f:
            compiledApprovalProgram = compileTeal(approvalProgram(platformAppId), mode=Mode.Application, version=5)
            f.write(compiledApprovalProgram)

    clearFile = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'contracts', network, 'v1', 'fund', 'teal', 'clear.teal')
    if __name__ == "__main__":
        with open(clearFile, 'w') as f:
            compiledClearProgram = compileTeal(clearProgram(), mode=Mode.Signature, version=5)
            f.write(compiledClearProgram)


compileContracts('betanet', Int(apps["betanet"]))
compileContracts('testnet', Int(apps["testnet"]))