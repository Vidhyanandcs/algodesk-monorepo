from pyteal import *
from src.contracts.utils.utils import *
import src.contracts.v1.revenue.state.global_state as globalState
import src.contracts.v1.revenue.state.local_state as localState
import src.contracts.v1.fund.state.global_state as fundGlobalState


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
    publishFee = Int(1000000)
    platformSuccessFee = Int(1)

    setState = [
        App.globalPut(globalState.version, version),
        App.globalPut(globalState.creator, creator),
        App.globalPut(globalState.created_at, createdAt),
        App.globalPut(globalState.escrow, escrow),
        App.globalPut(globalState.publish_fee, publishFee),
        App.globalPut(globalState.platform_success_fee, platformSuccessFee),
        App.globalPut(globalState.funds_deployed, fundsDeployed)
    ]

    conditions = gtxnAssertions + setState + [Approve()]

    block = Seq(conditions)
    return block

def validateFund():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(5)),
        Assert(Txn.group_index() == Int(1))
    ]

    paymentTxn = Gtxn[0]

    paymentAssertions = [
        Assert(paymentTxn.sender() == Txn.sender()),
        Assert(paymentTxn.type_enum() == TxnType.Payment),
        Assert(paymentTxn.receiver() == Global.current_application_address()),
        Assert(paymentTxn.amount() == App.globalGet(globalState.publish_fee))
    ]

    fundPublishTxn = Gtxn[3]
    fundPublishTxnArgs = fundPublishTxn.application_args

    fundAppAssertions = [
        Assert(fundPublishTxn.type_enum() == TxnType.ApplicationCall),
        Assert(fundPublishTxnArgs[0] == Bytes("publish")),
        Assert(fundPublishTxn.application_id() == Txn.applications[1])
    ]

    applicationAssertions = [
        Assert(fundPublishTxn.sender() == Txn.sender())
    ]

    fundsDeployed = App.globalGet(globalState.funds_deployed)
    setState = [
        App.globalPut(globalState.funds_deployed, fundsDeployed + Int(1)),
    ]

    assetId = App.globalGetEx(Txn.applications[1], fundGlobalState.asset_id)
    assetIdValue = Seq([
        assetId,
        If(assetId.hasValue(), assetId.value(), Bytes("0"))
    ])

    innerTransactions = [
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: assetIdValue,
                TxnField.asset_receiver: Global.current_application_address(),
                TxnField.asset_amount: Int(0)
            }
        ),
        InnerTxnBuilder.Submit()
    ]

    conditions = gtxnAssertions + paymentAssertions + fundAppAssertions + applicationAssertions + innerTransactions + setState + [Approve()]

    block = Seq(conditions)
    return block

def approvalProgram():
    program = Cond(
        [isCreate(), createApplication()],
        [isUpdate(), Return(allowOperation())],
        [isDelete(), Return(allowOperation())],
        [Txn.application_args[0] == Bytes("validate_fund"), validateFund()],
    )
    return program
