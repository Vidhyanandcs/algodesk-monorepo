'use strict';

import {Algodesk, testnet, WalletSigner} from '../index';
import {Account, mnemonicToSecretKey, assignGroupID} from 'algosdk';

const mnemonic = 'quality family fork daring skirt increase arena enhance famous marble bracket kingdom huge dash hedgehog ask sport legal able rain kidney abandon theme absent elephant';
const keys: Account = mnemonicToSecretKey(mnemonic);

// const token = {"X-API-Key": '3jyPjXbQvf6E9LyEtbgKL7pKaN3qa0wW5QAecYOK'};
// testnet.setAlgodServer('https://testnet-algorand.api.purestake.io/ps2', token);
// testnet.setIndexerServer('https://testnet-algorand.api.purestake.io/idx2', token);

const walletSigner = new WalletSigner();
walletSigner.setWallet(keys);

const algodesk = new Algodesk(testnet, walletSigner);

test('account client tests', async () => {

    const accountInfo = await algodesk.accountClient.getAccountInformation("X73QTD65VIYOFEB53LA3AY44U6TTEXVYVEQGHGBHOUSGSJPJNI6DHPWDD4");
    // const createdAssets = await algodesk.accountClient.getCreatedAssets("ZHKAFJY5CDRDZKLW72JJBMT277D2TFZZ6G6BNJA7FJICQY5EJRQ5L6VR5M");
    // console.log(createdAssets.length);
    //
    // const holdingAssets = await algodesk.accountClient.getHoldingAssets("ZHKAFJY5CDRDZKLW72JJBMT277D2TFZZ6G6BNJA7FJICQY5EJRQ5L6VR5M");
    // console.log(holdingAssets.length);

    // const createdApps = await algodesk.accountClient.getCreatedApps("AFI6D2DTPCKN6GJPJ3ZGGW72ORTFCDOEMPW2ME6I4N53B4PJ7ZT3GMGFUI");
    // console.log(createdApps);

    // const optedApps = await algodesk.accountClient.getOptedApps(accountInfo);
    // console.log(optedApps);

});

test('payment client tests', async () => {
    // const suggestedParams = await algodesk.transactionClient.getSuggestedParams();
    // console.log(suggestedParams);

    //
    // const {txId} = await algodesk.paymentClient.payment(keys.addr, keys.addr, 0);
    // console.log(txId);
    //
    // const pendingTransactionInfo = await algodesk.transactionClient.waitForConfirmation(txId);
    // console.log(pendingTransactionInfo);
    //
    // const pendingTransactionInfo1 = await algodesk.transactionClient.pendingTransactionInformation(txId);
    // console.log(pendingTransactionInfo1);

    // const transactionInfo = await algodesk.transactionClient.get("ZXLBMAZBLI34YNVLOTEITBSM6PRZDNFLAMPNZZX4KGX5ESM6WKXQ");
    // console.log(transactionInfo);

    try {
        const txn1 = await algodesk.paymentClient.preparePaymentTxn(keys.addr, keys.addr, 0);
        const txn2 = await algodesk.paymentClient.preparePaymentTxn(keys.addr, keys.addr, 0);

        const txns = [txn1, txn2];
        const grpTxns = assignGroupID(txns);

        const txnsResponse = await algodesk.transactionClient.sendGroupTxns(grpTxns);
        console.log(txnsResponse);
    }
    catch (e) {
        console.log(e);
    }

});


