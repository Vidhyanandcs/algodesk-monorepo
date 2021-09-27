from pyteal import *
from contracts.utils.utils import *
import contracts.state.global_state as globalState
import contracts.state.local_state as localState


def createApplication():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    version = Int(1)
    state = Int(1)
    creator = Txn.sender()
    createdAt = currentRound

    name = txnArgs[0]
    assetId = Btoi(txnArgs[1])

    companyDetails = Txn.tx_id()
    regStartsAt = Btoi(txnArgs[2])
    regEndsAt = Btoi(txnArgs[3])

    saleStartsAt = Btoi(txnArgs[4])
    saleEndsAt = Btoi(txnArgs[5])

    totalAllocation = Btoi(txnArgs[6])
    remainingAllocation = totalAllocation

    minAllocation = Btoi(txnArgs[7])
    maxAllocation = Btoi(txnArgs[8])

    swapRatio = Btoi(txnArgs[9])
    noOfRegistrations = Int(0)
    noOfInvestors = Int(0)
    noOfClaims = Int(0)
    noOfWithdrawals = Int(0)
    escrow = Global.current_application_address()
    fundsClaimed = Int(0)
    fundsWithdrawn = Int(0)
    targetReached = Int(0)

    deploymentAssertions = [
        Assert(name != Bytes("")),

        Assert(regStartsAt > createdAt),
        Assert(regEndsAt > regStartsAt),

        Assert(saleStartsAt > regEndsAt),
        Assert(saleEndsAt > saleStartsAt),

        Assert(minAllocation > Int(0)),
        Assert(maxAllocation >= minAllocation),

        Assert(totalAllocation >= maxAllocation),

        Assert(swapRatio > Int(0)),
        Assert(swapRatio <= maxAllocation),
    ]

    setState = [
        App.globalPut(globalState.version, version),
        App.globalPut(globalState.state, state),
        App.globalPut(globalState.creator, creator),
        App.globalPut(globalState.created_at, createdAt),
        App.globalPut(globalState.name, name),
        App.globalPut(globalState.company_details, companyDetails),
        App.globalPut(globalState.asset_id, assetId),
        App.globalPut(globalState.reg_starts_at, regStartsAt),
        App.globalPut(globalState.reg_ends_at, regEndsAt),
        App.globalPut(globalState.sale_starts_at, saleStartsAt),
        App.globalPut(globalState.sale_ends_at, saleEndsAt),
        App.globalPut(globalState.claim_after, saleEndsAt),
        App.globalPut(globalState.total_allocation, totalAllocation),
        App.globalPut(globalState.remaining_allocation, remainingAllocation),
        App.globalPut(globalState.min_allocation, minAllocation),
        App.globalPut(globalState.max_allocation, maxAllocation),
        App.globalPut(globalState.swap_ratio, swapRatio),
        App.globalPut(globalState.no_of_registrations, noOfRegistrations),
        App.globalPut(globalState.no_of_investors, noOfInvestors),
        App.globalPut(globalState.no_of_claims, noOfClaims),
        App.globalPut(globalState.no_of_withdrawls, noOfWithdrawals),
        App.globalPut(globalState.escrow, escrow),
        App.globalPut(globalState.funds_claimed, fundsClaimed),
        App.globalPut(globalState.funds_withdrawn, fundsWithdrawn),
        App.globalPut(globalState.target_reached, targetReached),
    ]


    conditions = gtxnAssertions + deploymentAssertions + setState + [Approve()]

    block = Seq(conditions)
    return block


def fundEscrow():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(3)),
        Assert(Txn.group_index() == Int(1)),
    ]

    paymentTxn = Gtxn[0]

    paymentAssertions = [
        Assert(paymentTxn.sender() == App.globalGet(globalState.creator)),
        Assert(paymentTxn.sender() == Txn.sender()),
        Assert(paymentTxn.type_enum() == TxnType.Payment),
        Assert(paymentTxn.receiver() == App.globalGet(globalState.escrow)),
        Assert(paymentTxn.amount() == Int(2000000))
    ]

    assetXferTxn = Gtxn[2]

    totalAllocation = App.globalGet(globalState.total_allocation)
    micros = getAssetMicros()
    totalAllocationInMicros = totalAllocation * micros

    assetAssertions = [
        Assert(assetXferTxn.sender() == App.globalGet(globalState.creator)),
        Assert(assetXferTxn.sender() == Txn.sender()),
        Assert(assetXferTxn.type_enum() == TxnType.AssetTransfer),
        Assert(assetXferTxn.asset_receiver() == App.globalGet(globalState.escrow)),
        Assert(assetXferTxn.xfer_asset() == App.globalGet(globalState.asset_id)),
        Assert(assetXferTxn.asset_amount() == totalAllocation)
    ]

    applicationAssertions = [
        Assert(Txn.sender() == App.globalGet(globalState.creator)),
        Assert(currentRound < App.globalGet(globalState.reg_starts_at)),
        Assert(App.globalGet(globalState.state) == Int(1))
    ]

    setState = [
        App.globalPut(globalState.state, Int(2))
    ]

    innerTransactions = [
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: App.globalGet(globalState.asset_id),
                TxnField.asset_receiver: App.globalGet(globalState.escrow),
                TxnField.asset_amount: Int(0)
            }
        ),
        InnerTxnBuilder.Submit()
    ]

    conditions = gtxnAssertions + paymentAssertions + assetAssertions + applicationAssertions + innerTransactions + setState + [Approve()]

    block = Seq(conditions)

    return block


def approvalProgram():
    program = Cond(
        [isCreate(), createApplication()],
        [isUpdate(), Return(allowOperation())],
        [Txn.application_args[0] == Bytes("fund_escrow"), fundEscrow()],
    )
    return program
