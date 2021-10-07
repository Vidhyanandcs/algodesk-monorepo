from pyteal import *
from src.contracts.utils.utils import *
import src.contracts.v1.revenue.state.global_state as globalState
import src.contracts.v1.revenue.state.local_state as localState


def createApplication():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    version = Int(1)
    creator = Txn.sender()
    createdAt = currentRound

    setState = [
        App.globalPut(globalState.version, version),
        App.globalPut(globalState.creator, creator),
        App.globalPut(globalState.created_at, createdAt)
    ]

    conditions = gtxnAssertions + setState + [Approve()]

    block = Seq(conditions)
    return block

def approvalProgram():
    program = Cond(
        [isCreate(), createApplication()],
        [isUpdate(), Return(allowOperation())],
    )
    return program
