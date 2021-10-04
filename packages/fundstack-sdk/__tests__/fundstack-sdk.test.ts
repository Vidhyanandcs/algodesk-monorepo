'use strict';

import {Account, generateAccount, mnemonicToSecretKey, secretKeyToMnemonic} from "algosdk";
import {A_CreateAssetParams, betanet, WalletSigner} from "@algodesk/core";
import {Fundstack} from '../index';
import {F_CompanyDetails, F_DeployFund} from "../src/types";

const mnemonic = 'lazy reduce promote seat provide pottery setup focus below become quick immense steel there grunt undo hollow fragile bitter sick prefer asset man about foster';
const dispenserAccount = mnemonicToSecretKey(mnemonic);//CJW7LXVNIHJDDLOVIPP4YABAGINXURO7HZEZQYUH27FTFCQ7QWKZ7GO4UQ

async function dispense(account: Account, amount: number = 5) {
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
        decimals: 0,
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



        const networkParams = await fundRaiserInstance.algodesk.transactionClient.getSuggestedParams();
    
        const fundParams: F_DeployFund = {
            from: fundRaiser.addr,
            assetId: assetId,
            maxAllocation: 800,
            minAllocation: 100,
            name: "Testing v1 fund",
            regStartsAt: networkParams.firstRound + 10,
            regEndsAt: networkParams.firstRound + 20,
            saleStartsAt: networkParams.firstRound + 30,
            saleEndsAt: networkParams.firstRound + 40,
            swapRatio: 600,
            totalAllocation: 1000
        };
    
        const companyDetails: F_CompanyDetails = {
            github: "https://google.com/1",
            twitter: "https://google.com/1",
            website: "https://google.com/1",
            whitePaper: "https://google.com/1"
        };

        console.log('deploying fund');
        const {txId} = await fundRaiserInstance.deploy(fundParams, companyDetails);
        await fundRaiserInstance.algodesk.transactionClient.waitForConfirmation(txId);
        const pendingTransactionInfo = await fundRaiserInstance.algodesk.transactionClient.pendingTransactionInformation(txId);


        const appId = pendingTransactionInfo['application-index'];

        
        console.log('funding escrow');
        const {txId: escTxId} = await fundRaiserInstance.fundEscrow(appId);
        await fundRaiserInstance.algodesk.transactionClient.waitForConfirmation(escTxId);
        
        
        console.log('waiting for registration to start');
        await investorInstance.algodesk.transactionClient.waitForBlock(fundParams.regStartsAt);
        console.log('investor registering');
        const {txId: regTxId} = await investorInstance.register(appId, investor.addr);
        await investorInstance.algodesk.transactionClient.waitForConfirmation(regTxId);


        console.log('waiting for sale to start');
        await investorInstance.algodesk.transactionClient.waitForBlock(fundParams.saleStartsAt);
        console.log('investor investing');
        const {txId: invTxId} = await investorInstance.invest(appId, investor.addr, 1);
        await investorInstance.algodesk.transactionClient.waitForConfirmation(invTxId);


        console.log('waiting for claim to start');
        await investorInstance.algodesk.transactionClient.waitForBlock(fundParams.saleEndsAt);
        console.log('investor claiming');
        const {txId: claimTxId} = await investorInstance.investorClaim(appId, investor.addr);
        await investorInstance.algodesk.transactionClient.waitForConfirmation(claimTxId);


        console.log('waiting for claim to start');
        await fundRaiserInstance.algodesk.transactionClient.waitForBlock(fundParams.saleEndsAt);
        console.log('owner claiming');
        const {txId: ownerClaimTxId} = await fundRaiserInstance.ownerClaim(appId, false);
        await fundRaiserInstance.algodesk.transactionClient.waitForConfirmation(ownerClaimTxId);


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


