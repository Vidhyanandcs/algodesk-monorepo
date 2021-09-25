from pyteal import *


def getAppId():
    return Txn.application_id()


def getTxnAction():
    return Txn.on_completion()


def isCreate():
    return getAppId() == Int(0)


def isUpdate():
    return getTxnAction() == OnComplete.UpdateApplication


def isDelete():
    return getTxnAction() == OnComplete.DeleteApplication


def isOptIn():
    return getTxnAction() == OnComplete.OptIn


def isCloseOut():
    return getTxnAction() == OnComplete.CloseOut


def getAssetMicros():
    assetDecimal = AssetParam.decimals(Int(0))
    micros = Seq([
        assetDecimal,
        Int(10) ** assetDecimal.value()
    ])

    return micros
