import os
from pyteal import *
from src.contracts.burn import burnProgram

def compileContracts():
    burnFile = os.path.join(os.path.dirname(__file__), '..', '..', 'contracts', 'burn.teal')
    if __name__ == "__main__":
        with open(burnFile, 'w') as f:
            compiledBurnProgram = compileTeal(burnProgram(Int(1111111)), mode=Mode.Signature, version=5)
            f.write(compiledBurnProgram)

compileContracts()