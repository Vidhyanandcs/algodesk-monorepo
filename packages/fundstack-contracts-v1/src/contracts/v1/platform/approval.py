from pyteal import *
from src.contracts.utils.utils import *
import src.contracts.v1.platform.state.global_state as globalState
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
    deployedCount = Int(0)
    publishFee = Int(1000000)
    successFee = Int(1)
    fundEscrowMinTopUp = Int(2000000)

    setState = [
        App.globalPut(globalState.version, version),
        App.globalPut(globalState.creator, creator),
        App.globalPut(globalState.created_at, createdAt),
        App.globalPut(globalState.escrow, escrow),
        App.globalPut(globalState.publish_fee, publishFee),
        App.globalPut(globalState.success_fee, successFee),
        App.globalPut(globalState.deployed_count, deployedCount),
        App.globalPut(globalState.fund_escrow_min_top_up, fundEscrowMinTopUp)
    ]

    conditions = gtxnAssertions + setState + [Approve()]

    block = Seq(conditions)
    return block

def validateFund():
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

    fundsDeployed = App.globalGet(globalState.deployed_count)
    setState = [
        App.globalPut(globalState.deployed_count, fundsDeployed + Int(1)),
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


def claimAlgos():
    txnArgs = Txn.application_args

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    amount = Btoi(txnArgs[1])
    amount = AlgoToMicroAlgo(amount)

    applicationAssertions = [
        Assert(Txn.sender() == App.globalGet(globalState.creator))
    ]

    innerTransactions = [
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: App.globalGet(globalState.creator),
                TxnField.amount: amount
            }
        ),
        InnerTxnBuilder.Submit()
    ]

    conditions = gtxnAssertions + applicationAssertions + innerTransactions + [Approve()]

    block = Seq(conditions)

    return block


def claimAssets():
    txnArgs = Txn.application_args

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    amount = Btoi(txnArgs[1])
    assetId = Txn.assets[0]
    assetMicros = getAssetMicros(Int(0))
    amount = amount * assetMicros

    applicationAssertions = [
        Assert(Txn.sender() == App.globalGet(globalState.creator))
    ]

    innerTransactions = [
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: assetId,
                TxnField.asset_receiver: App.globalGet(globalState.creator),
                TxnField.asset_amount: amount
            }
        ),
        InnerTxnBuilder.Submit()
    ]

    conditions = gtxnAssertions + applicationAssertions + innerTransactions + [Approve()]

    block = Seq(conditions)

    return block


def approvalProgram():
    program = Cond(
        [isCreate(), createApplication()],
        [isUpdate(), Return(allowOperation())],
        [isDelete(), Return(allowOperation())],
        [Txn.application_args[0] == Bytes("validate_fund"), validateFund()],
        [Txn.application_args[0] == Bytes("claim_algos"), claimAlgos()],
        [Txn.application_args[0] == Bytes("claim_assets"), claimAssets()],
    )
    return program
