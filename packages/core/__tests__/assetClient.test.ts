'use strict';

import {
    Algodesk,
    encodeText,
    A_CreateAssetParams,
    A_FreezeAssetParams,
    A_ModifyAssetParams,
    testnet,
    WalletSigner
} from '../index';
import {Account, mnemonicToSecretKey, assignGroupID, AssetDestroyTxn, AssetTransferTxn, AssetFreezeTxn} from 'algosdk';
import {AssetTransferTransaction} from "algosdk/dist/types/src/types/transactions/asset";

const mnemonic = 'quality family fork daring skirt increase arena enhance famous marble bracket kingdom huge dash hedgehog ask sport legal able rain kidney abandon theme absent elephant';
const keys: Account = mnemonicToSecretKey(mnemonic);

// const token = {"X-API-Key": '3jyPjXbQvf6E9LyEtbgKL7pKaN3qa0wW5QAecYOK'};
// testnet.setAlgodServer('https://testnet-algorand.api.purestake.io/ps2', token);
// testnet.setIndexerServer('https://testnet-algorand.api.purestake.io/idx2', token);

const walletSigner = new WalletSigner();
walletSigner.setWallet(keys);

const algodesk = new Algodesk(testnet, walletSigner);

test('account client tests', async () => {

    // const accountInfo = await algodesk.accountClient.getAccountInformation("X73QTD65VIYOFEB53LA3AY44U6TTEXVYVEQGHGBHOUSGSJPJNI6DHPWDD4");
    // const createdAssets = await algodesk.accountClient.getCreatedAssets(accountInfo);
    // console.log(createdAssets.length);
    //
    // const holdingAssets = await algodesk.accountClient.getHoldingAssets(accountInfo);
    // console.log(holdingAssets.length);
    //
    // const createdApps = await algodesk.accountClient.getCreatedApps(accountInfo);
    // console.log(createdApps);
    //
    // const optedApps = await algodesk.accountClient.getOptedApps(accountInfo);
    // console.log(optedApps);

});

test('payment client tests', async () => {
    const suggestedParams = await algodesk.transactionClient.getSuggestedParams();
    console.log(suggestedParams);


    const {txId} = await algodesk.paymentClient.payment(keys.addr, keys.addr, 0);
    console.log(txId);

    const pendingTransactionInfo = await algodesk.transactionClient.waitForConfirmation(txId);
    console.log(pendingTransactionInfo);

    const pendingTransactionInfo1 = await algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log(pendingTransactionInfo1);

    // const transactionInfo = await algodesk.transactionClient.get("ZXLBMAZBLI34YNVLOTEITBSM6PRZDNFLAMPNZZX4KGX5ESM6WKXQ");
    // console.log(transactionInfo);

    // const txn1 = await algodesk.paymentClient.preparePaymentTxn(keys.addr, keys.addr, 0.1);
    // const txn2 = await algodesk.paymentClient.preparePaymentTxn(keys.addr, keys.addr, 0.1);
    //
    // const txns = [txn1, txn2];
    // const grpTxns = assignGroupID(txns);
    //
    // const txnsResponse = await algodesk.transactionClient.sendGroupTxns(grpTxns);
    // console.log(txnsResponse);
});

test('asset client tests', async () => {

    // const assetConfig: A_CreateAssetParams = {
    //     creator: keys.addr,
    //     total: 100,
    //     decimals: 0,
    //     name: "test asset",
    //     unitName: "test",
    //     manager: keys.addr,
    //     reserve: keys.addr,
    //     freeze: keys.addr,
    //     clawback: keys.addr,
    //     defaultFrozen: false,
    //     url: "https://google.com"
    // };
    //
    // const {txId} = await algodesk.assetClient.create(assetConfig, "testing");
    // const pendingTransactionInfo = await algodesk.transactionClient.waitForConfirmation(txId);
    // console.log(pendingTransactionInfo);

    // const assetConfig1: A_ModifyAssetParams = {
    //     assetIndex: 22480818,
    //     from: keys.addr,
    //     strictEmptyAddressChecking: false,
    //     freeze: undefined,
    //     manager: keys.addr,
    //     reserve: keys.addr,
    //     clawback: keys.addr
    // }
    //
    // const {txId} = await algodesk.assetClient.modify(assetConfig1);
    // const pendingTransactionInfo = await algodesk.transactionClient.waitForConfirmation(txId);
    // console.log(pendingTransactionInfo);

    // const {txId} = await algodesk.assetClient.destroy(keys.addr, 22462050);
    // const pendingTransactionInfo = await algodesk.transactionClient.waitForConfirmation(txId);
    // console.log(pendingTransactionInfo);

    // const asset = await algodesk.assetClient.get(15992385);
    // console.log(asset.params.nameB64);

    // const frzConfig: A_FreezeAssetParams = {
    //     from: keys.addr,
    //     assetIndex: 16000210,
    //     freezeAccount: "NXZMOAZWDLTELNSVULPQZQFBDZAVZ4TYEST6IMMOFONFZMPCMCPYVDWIFM",
    //     freezeState: false
    // };
    //
    // const {txId} = await algodesk.assetClient.freeze(frzConfig);
    // const pendingTransactionInfo = await algodesk.transactionClient.waitForConfirmation(txId);
    // console.log(pendingTransactionInfo);
});


