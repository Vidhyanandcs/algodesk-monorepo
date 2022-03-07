'use strict';

import {Account, generateAccount, mnemonicToSecretKey} from "algosdk";
import {A_CreateAssetParams, betanet, testnet, WalletSigner} from "@algodesk/core";
import {Fundstack} from '../index';
import {F_PoolMetaData, F_CreatePool} from "../src/types";

const mnemonic = 'lazy reduce promote seat provide pottery setup focus below become quick immense steel there grunt undo hollow fragile bitter sick prefer asset man about foster';
const dispenserAccount = mnemonicToSecretKey(mnemonic);//CJW7LXVNIHJDDLOVIPP4YABAGINXURO7HZEZQYUH27FTFCQ7QWKZ7GO4UQ

// const network = betanet;
// const platformAppId = 638672503;

const network = testnet;
const platformAppId = 58162217;

async function dispense(account: Account, amount: number = 9) {
    const walletSigner = new WalletSigner(dispenserAccount);
    const dispenserInstance = new Fundstack(platformAppId, network, walletSigner);
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
        decimals: 0,
        defaultFrozen: false,
        freeze: account.addr,
        manager: account.addr,
        name: "Atlas",
        reserve: account.addr,
        total: 1000000,
        unitName: "STL",
        url: ""
    };

    console.log('creating asset...');
    const {txId} = await instance.algodesk.assetClient.create(params);
    await instance.algodesk.transactionClient.waitForConfirmation(txId);
    const pendingTransactionInfo = await instance.algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log('Asset created ID: ' + pendingTransactionInfo['asset-index']);
    return pendingTransactionInfo;
}

async function create(instance: Fundstack, account: Account, assetId: number) {
    const networkParams = await instance.algodesk.transactionClient.getSuggestedParams();

    const poolParams: F_CreatePool = {
        from: account.addr,
        assetId: assetId,
        maxAllocation: 3,
        minAllocation: 2,
        name: "Star Atlas " + Math.floor(Math.random()*(999-100+1)+100),
        regStartsAt: networkParams.firstRound + 10,
        regEndsAt: networkParams.firstRound + 45,
        saleStartsAt: networkParams.firstRound + 50,
        saleEndsAt: networkParams.firstRound + 85,
        price: 0.1,
        totalAllocation: 10
    };

    const companyDetails: F_PoolMetaData = {
        github: "https://google.com/1",
        twitter: "https://google.com/1",
        website: "https://google.com/1",
        whitePaper: "https://google.com/1",
        tokenomics: 'https://google.com/1'
    };

    console.log('creating pool');
    const {txId} = await instance.createPool(poolParams, companyDetails);
    await instance.algodesk.transactionClient.waitForConfirmation(txId);
    const pendingTransactionInfo = await instance.algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log("Pool ID: " + pendingTransactionInfo['application-index']);
    return pendingTransactionInfo;
}


async function publish(instance: Fundstack, appId: number) {
    console.log('publishing pool');
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
        const poolOwner = generateAccount();
        const fWalletSigner = new WalletSigner(poolOwner);
        const poolOwnerInstance = new Fundstack(platformAppId, network, fWalletSigner);
        await dispense(poolOwner);
        const asset = await createAsset(poolOwner, poolOwnerInstance);
        const assetId = asset["asset-index"];

        const investor = generateAccount();
        const iWalletSigner = new WalletSigner(investor);
        const investorInstance = new Fundstack(platformAppId, network, iWalletSigner);
        await dispense(investor);

        const appDetails = await create(poolOwnerInstance, poolOwner, assetId);
        const appId = appDetails['application-index'];

        await publish(poolOwnerInstance, appId);

        const poolApp = await investorInstance.getPool(appId);

        await register(investorInstance, appId, investor,  poolApp.getRegStart());

        await invest(investorInstance, appId, investor, poolApp.getSaleStart(), 0.3);

        // await investorClaim(investorInstance, appId, investor, poolApp.getSaleEnd());
        //
        // await ownerClaim(poolOwnerInstance, appId, poolOwner, poolApp.getSaleEnd());

        await investorWithdraw(investorInstance, appId, investor, poolApp.getSaleEnd());

        await ownerWithdraw(poolOwnerInstance, appId, poolApp.getSaleEnd());


        console.log('investor returning unspent balance');
        const {txId: invReturnTxId} = await investorInstance.algodesk.paymentClient.payment(investor.addr, dispenserAccount.addr, 3);
        await investorInstance.algodesk.transactionClient.waitForConfirmation(invReturnTxId);


        console.log('pool owner returning unspent balance');
        const {txId: ownerReturnTxId} = await poolOwnerInstance.algodesk.paymentClient.payment(poolOwner.addr, dispenserAccount.addr, 1);
        await poolOwnerInstance.algodesk.transactionClient.waitForConfirmation(ownerReturnTxId);

        console.log('flow completed');
    }
    catch (e) {
        console.log(e);
    }
});




// test('fundstack', async () => {
//     try {
//         const fs = new Fundstack(platformAppId, network);
//         const txs = await fs.getPublishedFunds('https://fundstack-serverless-api.vercel.app');
//     }
//     catch (e) {
//         console.log(e);
//     }
// });

