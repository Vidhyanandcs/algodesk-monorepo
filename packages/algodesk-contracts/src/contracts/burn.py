from pyteal import *

def burnProgram(assetId):

    gtxnAssertions = [
        Assert(Global.group_size() == Int(1)),
        Assert(Txn.group_index() == Int(0)),
    ]

    assetXferAssertions = [
        Assert(Txn.type_enum() == TxnType.AssetTransfer),
        Assert(Txn.sender() == Txn.asset_receiver()),
        Assert(Txn.xfer_asset() == assetId),
        Assert(Txn.asset_amount() == Int(0))
    ]

    conditions = gtxnAssertions + assetXferAssertions + [Approve()]

    block = Seq(conditions)
    return block