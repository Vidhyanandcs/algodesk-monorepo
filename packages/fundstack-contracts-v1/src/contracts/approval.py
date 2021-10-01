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
        Assert(swapRatio <= maxAllocation)
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
        App.globalPut(globalState.target_reached, targetReached)
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

    assetId = Txn.assets[0]
    assetAssertions = [
        Assert(assetId == App.globalGet(globalState.asset_id)),
    ]

    paymentTxn = Gtxn[0]

    paymentAssertions = [
        Assert(paymentTxn.sender() == App.globalGet(globalState.creator)),
        Assert(paymentTxn.sender() == Txn.sender()),
        Assert(paymentTxn.type_enum() == TxnType.Payment),
        Assert(paymentTxn.receiver() == Global.current_application_address()),
        Assert(paymentTxn.amount() == Int(2000000))
    ]

    assetXferTxn = Gtxn[2]

    totalAllocation = App.globalGet(globalState.total_allocation)
    micros = getAssetMicros(Int(0))
    totalAllocationInMicros = totalAllocation * micros

    assetXferAssertions = [
        Assert(assetXferTxn.sender() == App.globalGet(globalState.creator)),
        Assert(assetXferTxn.sender() == Txn.sender()),
        Assert(assetXferTxn.type_enum() == TxnType.AssetTransfer),
        Assert(assetXferTxn.asset_receiver() == Global.current_application_address()),
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

    conditions = gtxnAssertions + assetAssertions + paymentAssertions + assetXferAssertions + applicationAssertions + innerTransactions + setState + [Approve()]

    block = Seq(conditions)

    return block

def register():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    registered = App.localGet(Int(0), localState.registered)
    applicationAssertions = [
        Assert(registered == Int(0)),
        Assert(App.globalGet(globalState.state) == Int(2)),
        Assert(currentRound >= App.globalGet(globalState.reg_starts_at)),
        Assert(currentRound <= App.globalGet(globalState.reg_ends_at)),
    ]

    noOfRegistrations = App.globalGet(globalState.no_of_registrations)
    setState = [
        App.globalPut(globalState.no_of_registrations, noOfRegistrations + Int(1)),
        App.localPut(Int(0), localState.registered, Int(1)),
        App.localPut(Int(0), localState.invested, Int(0)),
        App.localPut(Int(0), localState.claimed, Int(0)),
        App.localPut(Int(0), localState.invested_amount, Int(0))
    ]

    conditions = gtxnAssertions + applicationAssertions + setState + [Approve()]

    block = Seq(conditions)

    return block


def invest():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(2)),
        Assert(Txn.group_index() == Int(1)),
    ]

    paymentTransaction = Gtxn[0]
    algos = microAlgoToAlgo(paymentTransaction.amount())

    paymentAssertions = [
        Assert(paymentTransaction.type_enum() == TxnType.Payment),
        Assert(paymentTransaction.amount() > Int(0)),
        Assert(algos % Int(1) == Int(0)),
        Assert(paymentTransaction.sender() == Txn.sender()),
        Assert(paymentTransaction.receiver() == Global.current_application_address()),
    ]

    remainingAllocation = App.globalGet(globalState.remaining_allocation)
    investedAmount = algos * App.globalGet(globalState.swap_ratio)

    applicationAssertions = [
        Assert(App.localGet(Int(0), localState.registered) == Int(1)),
        Assert(App.localGet(Int(0), localState.invested) == Int(0)),
        Assert(App.globalGet(globalState.state) == Int(2)),
        Assert(investedAmount >= App.globalGet(globalState.min_allocation)),
        Assert(investedAmount <= App.globalGet(globalState.max_allocation)),
        Assert(currentRound >= App.globalGet(globalState.sale_starts_at)),
        Assert(currentRound <= App.globalGet(globalState.sale_ends_at)),
        Assert(remainingAllocation >= investedAmount)
    ]

    soldAllocation = App.globalGet(globalState.total_allocation) - App.globalGet(globalState.remaining_allocation)
    soldAllocation = soldAllocation + investedAmount
    soldAllocationRatio = soldAllocation / App.globalGet(globalState.total_allocation)
    soldAllocationPercentage = soldAllocationRatio * Int(100)

    targetReached = If(soldAllocationPercentage >= Int(50),
                       Int(1),
                       Int(0)
                       )

    setState = [
        App.globalPut(globalState.no_of_investors, App.globalGet(globalState.no_of_investors) + Int(1)),
        App.globalPut(globalState.remaining_allocation, remainingAllocation - investedAmount),
        App.globalPut(globalState.target_reached, targetReached),
        App.localPut(Int(0), localState.invested, Int(1)),
        App.localPut(Int(0), localState.invested_amount, investedAmount)
    ]

    conditions = gtxnAssertions + paymentAssertions + applicationAssertions + setState + [Approve()]

    block = Seq(conditions)

    return block


def deleteFund():
    applicationAssertions = [
        Assert(App.globalGet(globalState.state) == Int(1))
    ]

    conditions = applicationAssertions + [Approve()]

    block = Seq(conditions)

    return block


def investorClaim():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(2)),
        Assert(Txn.group_index() == Int(1)),
    ]

    assetId = Txn.assets[0]
    assetAssertions = [
        Assert(assetId == App.globalGet(globalState.asset_id)),
    ]

    assetXferTxn = Gtxn[0]

    assetXferAssertions = [
        Assert(assetXferTxn.sender() == Txn.sender()),
        Assert(assetXferTxn.type_enum() == TxnType.AssetTransfer),
        Assert(assetXferTxn.asset_receiver() == assetXferTxn.sender()),
        Assert(assetXferTxn.xfer_asset() == App.globalGet(globalState.asset_id)),
        Assert(assetXferTxn.asset_amount() == Int(0))
    ]

    investedAmount = App.localGet(Int(0), localState.invested_amount)
    micros = getAssetMicros(Int(0))

    investedAmountInMicros = investedAmount * micros

    applicationAssertions = [
        Assert(currentRound > App.globalGet(globalState.claim_after)),
        Assert(App.globalGet(globalState.state) == Int(2)),
        Assert(App.globalGet(globalState.target_reached) == Int(1)),
        Assert(App.localGet(Int(0), localState.registered) == Int(1)),
        Assert(App.localGet(Int(0), localState.invested) == Int(1)),
        Assert(App.localGet(Int(0), localState.claimed) == Int(0))
    ]

    innerTransactions = [
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.AssetTransfer,
                TxnField.xfer_asset: App.globalGet(globalState.asset_id),
                TxnField.asset_receiver: Txn.sender(),
                TxnField.asset_amount: investedAmountInMicros
            }
        ),
        InnerTxnBuilder.Submit()
    ]

    noOfClaims = App.globalGet(globalState.no_of_claims)
    setState = [
        App.globalPut(globalState.no_of_claims, noOfClaims + Int(1)),
        App.localPut(Int(0), localState.claimed, Int(1))
    ]

    conditions = gtxnAssertions + assetAssertions + assetXferAssertions + applicationAssertions + innerTransactions + setState + [Approve()]

    block = Seq(conditions)

    return block


def investorWithdraw():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    investedAmount = App.localGet(Int(0), localState.invested_amount)
    claimableAmount = investedAmount / App.globalGet(globalState.swap_ratio)
    claimableAmount = AlgoToMicroAlgo(claimableAmount)

    applicationAssertions = [
        Assert(currentRound > App.globalGet(globalState.claim_after)),
        Assert(App.globalGet(globalState.state) == Int(2)),
        Assert(App.globalGet(globalState.target_reached) == Int(0)),
        Assert(App.localGet(Int(0), localState.registered) == Int(1)),
        Assert(App.localGet(Int(0), localState.invested) == Int(1)),
        Assert(App.localGet(Int(0), localState.withdrawn) == Int(0))
    ]

    innerTransactions = [
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: claimableAmount
            }
        ),
        InnerTxnBuilder.Submit()
    ]

    noOfWithdrawls = App.globalGet(globalState.no_of_withdrawls)
    setState = [
        App.globalPut(globalState.no_of_withdrawls, noOfWithdrawls + Int(1)),
        App.localPut(Int(0), localState.withdrawn, Int(1))
    ]

    conditions = gtxnAssertions + applicationAssertions + innerTransactions + setState + [Approve()]

    block = Seq(conditions)

    return block


def ownerClaim():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    burnUnsoldAssets = Btoi(txnArgs[1])
    validBurnParam = Or(burnUnsoldAssets == Int(0),burnUnsoldAssets == Int(1))
    argsAssertions = [
        Assert(validBurnParam)
    ]

    assetId = Txn.assets[0]
    assetAssertions = [
        Assert(assetId == App.globalGet(globalState.asset_id)),
    ]

    soldAllocation = App.globalGet(globalState.total_allocation) - App.globalGet(globalState.remaining_allocation)
    claimableAmount = soldAllocation / App.globalGet(globalState.swap_ratio)
    claimableAmount = AlgoToMicroAlgo(claimableAmount)

    applicationAssertions = [
        Assert(currentRound > App.globalGet(globalState.claim_after)),
        Assert(App.globalGet(globalState.state) == Int(2)),
        Assert(App.globalGet(globalState.target_reached) == Int(1)),
        Assert(Txn.sender() == App.globalGet(globalState.creator)),
        Assert(App.globalGet(globalState.funds_claimed) == Int(0))
    ]

    innerTransactionClaimAlgos = [
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields(
            {
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.sender(),
                TxnField.amount: claimableAmount
            }
        ),
        InnerTxnBuilder.Submit()
    ]

    setState = [
        App.globalPut(globalState.funds_claimed, Int(1))
    ]

    conditions = gtxnAssertions + argsAssertions + assetAssertions + applicationAssertions + innerTransactionClaimAlgos + setState

    remainingAllocation = App.globalGet(globalState.remaining_allocation)
    micros = getAssetMicros(Int(0))
    remainingAllocationInMicros = remainingAllocation * micros

    burnAssets = If(
                     burnUnsoldAssets == Int(0)
                 ).Then(
                     Seq(
                         [
                             InnerTxnBuilder.Begin(),
                             InnerTxnBuilder.SetFields(
                                 {
                                     TxnField.type_enum: TxnType.AssetTransfer,
                                     TxnField.xfer_asset: App.globalGet(globalState.asset_id),
                                     TxnField.asset_receiver: Txn.sender(),
                                     TxnField.asset_amount: remainingAllocationInMicros
                                 }
                             ),
                             InnerTxnBuilder.Submit()
                         ]
                     )
                 )

    block = Seq(Seq(conditions), burnAssets, Approve())

    return block


def ownerWithdraw():
    txnArgs = Txn.application_args
    currentRound = Global.round()

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1))
    ]

    assetId = Txn.assets[0]
    assetConfigAssertions = [
        Assert(assetId == App.globalGet(globalState.asset_id)),
    ]

    totalAllocation = App.globalGet(globalState.total_allocation)
    micros = getAssetMicros(Int(0))

    totalAllocationInMicros = totalAllocation * micros

    applicationAssertions = [
        Assert(currentRound > App.globalGet(globalState.claim_after)),
        Assert(App.globalGet(globalState.target_reached) == Int(0)),
        Assert(Txn.sender() == App.globalGet(globalState.creator)),
        Assert(App.globalGet(globalState.funds_withdrawn) == Int(0)),
    ]

    setState = [
        App.globalPut(globalState.funds_withdrawn, Int(1))
    ]

    innerTransactions = [
        InnerTxnBuilder.Begin(),
         InnerTxnBuilder.SetFields(
             {
                 TxnField.type_enum: TxnType.AssetTransfer,
                 TxnField.xfer_asset: App.globalGet(globalState.asset_id),
                 TxnField.asset_receiver: Txn.sender(),
                 TxnField.asset_amount: totalAllocationInMicros
             }
         ),
         InnerTxnBuilder.Submit()
    ]

    conditions = gtxnAssertions + assetConfigAssertions + applicationAssertions + innerTransactions + setState + [Approve()]

    block = Seq(conditions)

    return block


def approvalProgram():
    program = Cond(
        [isCreate(), createApplication()],
        [isUpdate(), Return(allowOperation())],
        [isDelete(), deleteFund()],
        [isOptIn(), register()],
        [Txn.application_args[0] == Bytes("fund_escrow"), fundEscrow()],
        [Txn.application_args[0] == Bytes("invest"), invest()],
        [Txn.application_args[0] == Bytes("investor_claim"), investorClaim()],
        [Txn.application_args[0] == Bytes("investor_withdraw"), investorWithdraw()],
        [Txn.application_args[0] == Bytes("owner_claim"), ownerClaim()],
        [Txn.application_args[0] == Bytes("owner_withdraw"), ownerWithdraw()]
    )
    return program
