from pyteal import *

def burnProgram(assetId):

    gtxnAssertions = [
        Assert(Global.group_size() == Int(2)),
        Assert(Txn.group_index() == Int(1)),
    ]

    paymentTxn = Gtxn[0]

    paymentAssertions = [
        Assert(paymentTxn.type_enum() == TxnType.Payment),
        Assert(paymentTxn.receiver()== Txn.sender()),
        Assert(paymentTxn.amount() == Int(201000)),
        Assert(paymentTxn.close_remainder_to() == Global.zero_address()),
        Assert(paymentTxn.rekey_to() == Global.zero_address())
    ]

    assetXferAssertions = [
        Assert(Txn.type_enum() == TxnType.AssetTransfer),
        Assert(Txn.sender() == Txn.asset_receiver()),
        Assert(Txn.xfer_asset() == assetId),
        Assert(Txn.asset_amount() == Int(0)),
        Assert(Txn.close_remainder_to() == Global.zero_address()),
        Assert(Txn.rekey_to() == Global.zero_address())
    ]

    conditions = gtxnAssertions + paymentAssertions + assetXferAssertions + [Approve()]

    block = Seq(conditions)
    return block