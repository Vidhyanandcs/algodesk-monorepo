from pyteal import *


@Subroutine(TealType.uint64)
def getAppId():
    return Txn.application_id()


@Subroutine(TealType.uint64)
def getTxnAction():
    return Txn.on_completion()


@Subroutine(TealType.uint64)
def isCreate():
    return getAppId() == Int(0)


@Subroutine(TealType.uint64)
def isUpdate():
    return getTxnAction() == OnComplete.UpdateApplication


@Subroutine(TealType.uint64)
def isDelete():
    return getTxnAction() == OnComplete.DeleteApplication


@Subroutine(TealType.uint64)
def isOptIn():
    return getTxnAction() == OnComplete.OptIn


@Subroutine(TealType.uint64)
def isCloseOut():
    return getTxnAction() == OnComplete.CloseOut


@Subroutine(TealType.uint64)
def getAssetMicros(foreignAsset: Expr) -> TealType.uint64:
    assetDecimal = AssetParam.decimals(foreignAsset)
    micros = Seq([
        assetDecimal,
        Int(10) ** assetDecimal.value()
    ])

    return micros


@Subroutine(TealType.uint64)
def blockOperation():
    return Int(0) == Int(1)


@Subroutine(TealType.uint64)
def allowOperation():
    return Int(1) == Int(1)


@Subroutine(TealType.uint64)
def microAlgoToAlgo(amount):
    return amount / Int(1000000)


@Subroutine(TealType.uint64)
def AlgoToMicroAlgo(amount):
    return amount * Int(1000000)


