from pyteal import *
from src.contracts.utils.utils import *
import src.contracts.v1.revenue.state.global_state as globalState
import src.contracts.v1.revenue.state.local_state as localState

DEPLOYMENT_FEE = Int(1000000)

def createApplication():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    version = Int(1)
    creator = Txn.sender()
    createdAt = currentRound
    escrow = Global.current_application_address()
    fundsDeployed = Int(0)

    setState = [
        App.globalPut(globalState.version, version),
        App.globalPut(globalState.creator, creator),
        App.globalPut(globalState.created_at, createdAt),
        App.globalPut(globalState.escrow, escrow),
        App.globalPut(globalState.funds_deployed, fundsDeployed)
    ]

    conditions = gtxnAssertions + setState + [Approve()]

    block = Seq(conditions)
    return block

def deployFund():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(3)),
        Assert(Txn.group_index() == Int(0))
    ]

    paymentTxn = Gtxn[1]

    paymentAssertions = [
        Assert(paymentTxn.sender() == Txn.sender()),
        Assert(paymentTxn.type_enum() == TxnType.Payment),
        Assert(paymentTxn.receiver() == Global.current_application_address()),
        Assert(paymentTxn.amount() == DEPLOYMENT_FEE)
    ]

    fundDeploymentTxn = Gtxn[2]

    fundDeploymentAssertions = [
        Assert(fundDeploymentTxn.sender() == Txn.sender())
    ]

    fundsDeployed = App.globalGet(globalState.funds_deployed)
    setState = [
        App.globalPut(globalState.funds_deployed, fundsDeployed + Int(1)),
    ]

    conditions = gtxnAssertions + paymentAssertions + fundDeploymentAssertions + setState + [Approve()]

    block = Seq(conditions)
    return block

def approvalProgram():
    program = Cond(
        [isCreate(), createApplication()],
        [isUpdate(), Return(allowOperation())],
        [Txn.application_args[0] == Bytes("deploy_fund"), deployFund()],
    )
    return program
