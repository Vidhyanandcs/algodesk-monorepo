from pyteal import *
from contracts.utils.utils import *
import contracts.state.global_state as globalState
import contracts.state.local_state as localState



def clearProgram():
    program = Int(1)
    return program
