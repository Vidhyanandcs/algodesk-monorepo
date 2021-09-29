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


def getAssetMicros(foreignAsset):
    assetDecimal = AssetParam.decimals(foreignAsset)
    micros = Seq([
        assetDecimal,
        Int(10) ** assetDecimal.value()
    ])

    return micros


def blockOperation():
    return Int(0) == Int(1)


def allowOperation():
    return Int(1) == Int(1)

def microAlgoToAlgo(amount):
    return amount / Int(1000000)

def AlgoToMicroAlgo(amount):
    return amount * Int(1000000)
