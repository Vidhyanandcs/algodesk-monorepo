from pyteal import *

assetId = Int(1111111)
appId = Int(2222222)

falseCondition = And(
    Int(0) == Int(1),
    Int(0) == Int(1)
)


def assetTransfer():
    safetyChecks = And(
        Txn.rekey_to() == Global.zero_address(),
        Txn.asset_close_to() == Global.zero_address()
    )

    appTxn = Gtxn[0]
    txnArgs = appTxn.application_args

    appTxnConditions = And(
        appTxn.type_enum() == TxnType.ApplicationCall,
        appTxn.application_id() == appId
    )

    commonAssetXferConditions = And(
        Txn.xfer_asset() == assetId,
        Txn.type_enum() == TxnType.AssetTransfer
    )

    assetOptIn = And(
        Global.group_size() == Int(3),
        Txn.group_index() == Int(2),
        Txn.asset_receiver() == Txn.sender(),
        Txn.asset_amount() == Int(0)
    )

    investorClaim = And(
        Global.group_size() == Int(2),
        Txn.group_index() == Int(1),
        Txn.asset_receiver() == appTxn.sender(),
        Txn.asset_amount() > Int(0)
    )

    ownerClaimRemainingAssets = And(
        Global.group_size() == Int(2),
        Txn.group_index() == Int(1),
        Txn.asset_receiver() == appTxn.sender(),
        Txn.asset_amount() > Int(0)
    )

    ownerWithdraw = And(
        Global.group_size() == Int(2),
        Txn.group_index() == Int(1),
        Txn.asset_receiver() == appTxn.sender(),
        Txn.asset_amount() > Int(0)
    )

    operation = txnArgs[0]

    conditions = Cond([operation == Bytes("set_escrow"), assetOptIn],
                      [operation == Bytes("investor_claim"), investorClaim],
                      [operation == Bytes("owner_claim_remaining_assets"), ownerClaimRemainingAssets],
                      [operation == Bytes("owner_withdraw"), ownerWithdraw],
                      [Int(1) == Int(1), falseCondition])

    program = And(
        safetyChecks,
        appTxnConditions,
        commonAssetXferConditions,
        conditions
    )

    return program


def fundsTransfer():
    safetyChecks = And(
        Txn.rekey_to() == Global.zero_address(),
        Txn.asset_close_to() == Global.zero_address()
    )

    appTxn = Gtxn[0]
    txnArgs = appTxn.application_args

    appTxnConditions = And(
        appTxn.type_enum() == TxnType.ApplicationCall,
        appTxn.application_id() == appId
    )

    ownerClaim = And(
        Global.group_size() == Int(2),
        Txn.group_index() == Int(1),
        Txn.receiver() == appTxn.sender(),
        Txn.amount() > Int(0)
    )

    investorWithdraw = And(
        Global.group_size() == Int(2),
        Txn.group_index() == Int(1),
        Txn.receiver() == appTxn.sender(),
        Txn.amount() > Int(0)
    )

    operation = txnArgs[0]

    conditions = Cond([operation == Bytes("owner_claim"), ownerClaim],
                      [operation == Bytes("investor_withdraw"), investorWithdraw],
                      [Int(1) == Int(1), falseCondition])

    program = And(
        safetyChecks,
        appTxnConditions,
        conditions
    )

    return program


def escrowProgram():
    logicSig = Cond(
        [Txn.type_enum() == TxnType.AssetTransfer, assetTransfer()],
        [Txn.type_enum() == TxnType.Payment, fundsTransfer()]
    )

    return logicSig
