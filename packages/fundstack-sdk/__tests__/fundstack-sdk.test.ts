'use strict';

import {Account, generateAccount, mnemonicToSecretKey} from "algosdk";
import {A_CreateAssetParams, betanet, WalletSigner} from "@algodesk/core";
import {Fund, Fundstack} from '../index';
import {F_CompanyDetails, F_DeployFund} from "../src/types";

const mnemonic = 'lazy reduce promote seat provide pottery setup focus below become quick immense steel there grunt undo hollow fragile bitter sick prefer asset man about foster';
const dispenserAccount = mnemonicToSecretKey(mnemonic);//CJW7LXVNIHJDDLOVIPP4YABAGINXURO7HZEZQYUH27FTFCQ7QWKZ7GO4UQ

async function dispense(account: Account, amount: number = 7) {
    const walletSigner = new WalletSigner(dispenserAccount);
    const dispenserInstance = new Fundstack(betanet, walletSigner);
    console.log('funding account: ' + account.addr);
    const {txId} = await dispenserInstance.algodesk.paymentClient.payment(dispenserAccount.addr, account.addr, amount, 'dispensing amount');
    await dispenserInstance.algodesk.transactionClient.waitForConfirmation(txId);
    const pendingTransactionInfo = await dispenserInstance.algodesk.transactionClient.pendingTransactionInformation(txId);
    return pendingTransactionInfo;
}

async function createAsset(account: Account, instance: Fundstack) {
    const params: A_CreateAssetParams = {
        clawback: account.addr,
        creator: account.addr,
        decimals: 1,
        defaultFrozen: false,
        freeze: account.addr,
        manager: account.addr,
        name: "Test Asset",
        reserve: account.addr,
        total: 1000000,
        unitName: "TS",
        url: ""
    };

    console.log('creating asset...');
    const {txId} = await instance.algodesk.assetClient.create(params);
    await instance.algodesk.transactionClient.waitForConfirmation(txId);
    const pendingTransactionInfo = await instance.algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log('Asset created ID: ' + pendingTransactionInfo['asset-index']);
    return pendingTransactionInfo;
}

async function deploy(instance: Fundstack, account: Account, assetId: number) {
    const networkParams = await instance.algodesk.transactionClient.getSuggestedParams();

    const fundParams: F_DeployFund = {
        from: account.addr,
        assetId: assetId,
        maxAllocation: 800,
        minAllocation: 100,
        name: "Testing v1 fund",
        regStartsAt: networkParams.firstRound + 10,
        regEndsAt: networkParams.firstRound + 20,
        saleStartsAt: networkParams.firstRound + 30,
        saleEndsAt: networkParams.firstRound + 40,
        price: 0.001,
        totalAllocation: 1000
    };

    const companyDetails: F_CompanyDetails = {
        github: "https://google.com/1",
        twitter: "https://google.com/1",
        website: "https://google.com/1",
        whitePaper: "https://google.com/1"
    };

    console.log('deploying fund');
    const {txId} = await instance.deploy(fundParams, companyDetails);
    await instance.algodesk.transactionClient.waitForConfirmation(txId);
    const pendingTransactionInfo = await instance.algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log("Fund ID: " + pendingTransactionInfo['application-index']);
    return pendingTransactionInfo;
}


async function publish(instance: Fundstack, appId: number) {
    console.log('publishing fund');
    const {txId} = await instance.publish(appId);
    return await instance.algodesk.transactionClient.waitForConfirmation(txId);
}

async function register(instance: Fundstack, appId: number, account: Account, regStartsAt: number) {
    console.log('waiting for registration to start');
    await instance.algodesk.transactionClient.waitForBlock(regStartsAt);
    console.log('investor registering');
    const {txId} = await instance.register(appId, account.addr);
    return await instance.algodesk.transactionClient.waitForConfirmation(txId);
}

async function invest(instance: Fundstack, appId: number, account: Account, saleStartsAt: number, amount: number) {
    console.log('waiting for sale to start');
    await instance.algodesk.transactionClient.waitForBlock(saleStartsAt);
    console.log('investor investing');
    const {txId} = await instance.invest(appId, account.addr, amount);
    return await instance.algodesk.transactionClient.waitForConfirmation(txId);
}

async function investorClaim(instance: Fundstack, appId: number, account: Account, saleEndsAt: number) {
    console.log('waiting for claim to start');
    await instance.algodesk.transactionClient.waitForBlock(saleEndsAt);
    console.log('investor claiming');
    const {txId} = await instance.investorClaim(appId, account.addr);
    return await instance.algodesk.transactionClient.waitForConfirmation(txId);
}

async function ownerClaim(instance: Fundstack, appId: number, account: Account, saleEndsAt: number) {
    console.log('waiting for claim to start');
    await instance.algodesk.transactionClient.waitForBlock(saleEndsAt);
    console.log('owner claiming');
    const {txId} = await instance.ownerClaim(appId, "donate");
    await instance.algodesk.transactionClient.waitForConfirmation(txId);
    const pendingTransactionInfo = await instance.algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log(pendingTransactionInfo);
}

async function investorWithdraw(instance: Fundstack, appId: number, account: Account, saleEndsAt: number) {
    console.log('waiting for claim to start');
    await instance.algodesk.transactionClient.waitForBlock(saleEndsAt);
    console.log('investor withdrawing');
    const {txId} = await instance.investorWithdraw(appId, account.addr);
    return await instance.algodesk.transactionClient.waitForConfirmation(txId);
}

async function ownerWithdraw(instance: Fundstack, appId: number, saleEndsAt: number) {
    console.log('waiting for claim to start');
    await instance.algodesk.transactionClient.waitForBlock(saleEndsAt);
    console.log('owner withdrawing');
    const {txId} = await instance.ownerWithdraw(appId);
    await instance.algodesk.transactionClient.waitForConfirmation(txId);
}

test('fundstack', async () => {
    try {
        const fundRaiser = generateAccount();
        const fWalletSigner = new WalletSigner(fundRaiser);
        const fundRaiserInstance = new Fundstack(betanet, fWalletSigner);
        await dispense(fundRaiser);
        const asset = await createAsset(fundRaiser, fundRaiserInstance);
        const assetId = asset["asset-index"];

        const investor = generateAccount();
        const iWalletSigner = new WalletSigner(investor);
        const investorInstance = new Fundstack(betanet, iWalletSigner);
        await dispense(investor);

        const appDetails = await deploy(fundRaiserInstance, fundRaiser, assetId);
        const appId = appDetails['application-index'];

        await publish(fundRaiserInstance, appId);

        const fundApp = await investorInstance.get(appId);

        await register(investorInstance, appId, investor,  fundApp.getRegStart());

        await invest(investorInstance, appId, investor, fundApp.getSaleStart(), 0.6);

        await investorClaim(investorInstance, appId, investor, fundApp.getSaleEnd());

        await ownerClaim(fundRaiserInstance, appId, fundRaiser, fundApp.getSaleEnd());

        // await investorWithdraw(investorInstance, appId, investor, fundApp.getSaleEnd());
        //
        // await ownerWithdraw(fundRaiserInstance, appId, fundApp.getSaleEnd());


        console.log('investor returning unspent balance');
        const {txId: invReturnTxId} = await investorInstance.algodesk.paymentClient.payment(investor.addr, dispenserAccount.addr, 3);
        await investorInstance.algodesk.transactionClient.waitForConfirmation(invReturnTxId);


        console.log('fundraiser returning unspent balance');
        const {txId: ownerReturnTxId} = await fundRaiserInstance.algodesk.paymentClient.payment(fundRaiser.addr, dispenserAccount.addr, 1);
        await fundRaiserInstance.algodesk.transactionClient.waitForConfirmation(ownerReturnTxId);

        console.log('flow completed');
    }
    catch (e) {
        console.log(e);
    }
});




// test('fundstack', async () => {
//     try {
//         const fs = new Fundstack(betanet);
//         const txs = await fs.getPublishedFundsIds();
//     }
//     catch (e) {
//         console.log(e);
//     }
// });

