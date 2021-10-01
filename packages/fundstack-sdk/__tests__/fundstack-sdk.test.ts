'use strict';

import {Account, mnemonicToSecretKey} from "algosdk";
import {Algodesk, betanet, WalletSigner} from "@algodesk/core";
import {Fundstack} from '../index';
import {F_CompanyDetails, F_DeployFund} from "../src/types";

const mnemonic = 'fine hope logic together enough biology sock delay all suit badge awake suggest cook spread grab airport moment isolate fold immense busy wedding abstract rail';
const keys: Account = mnemonicToSecretKey(mnemonic);

const walletSigner = new WalletSigner(keys);
walletSigner.setWallet(keys);
const fundstack = new Fundstack(betanet, walletSigner);

const investorMnemonic = 'quality family fork daring skirt increase arena enhance famous marble bracket kingdom huge dash hedgehog ask sport legal able rain kidney abandon theme absent elephant';
const investorKeys: Account = mnemonicToSecretKey(investorMnemonic);
const InvestorWalletSigner = new WalletSigner(investorKeys);
InvestorWalletSigner.setWallet(investorKeys);
const investorFundstack = new Fundstack(betanet, InvestorWalletSigner);

test('create fund', async () => {
    const networkParams = await fundstack.algodesk.transactionClient.getSuggestedParams();
    console.log(networkParams);

    const fundParams: F_DeployFund = {
        from: keys.addr,
        assetId: 408239549,
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

    try {

        const {txId} = await fundstack.deploy(fundParams, companyDetails);
        await fundstack.algodesk.transactionClient.waitForConfirmation(txId);
        const pendingTransactionInfo = await fundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
        console.log(pendingTransactionInfo);

        const appId = pendingTransactionInfo['application-index'];

        const {txId: escTxId} = await fundstack.fundEscrow(appId);
        await fundstack.algodesk.transactionClient.waitForConfirmation(escTxId);
        const pendingTransactionInfo1 = await fundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
        console.log(pendingTransactionInfo1);

        await investorFundstack.algodesk.transactionClient.waitForBlock(fundParams.regStartsAt);
        const {txId: regTxId} = await investorFundstack.register(appId, investorKeys.addr);
        await investorFundstack.algodesk.transactionClient.waitForConfirmation(regTxId);
        const pendingTransactionInfo2 = await investorFundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
        console.log(pendingTransactionInfo2);

        await investorFundstack.algodesk.transactionClient.waitForBlock(fundParams.saleStartsAt);
        const {txId: invTxId} = await investorFundstack.invest(appId, investorKeys.addr, 1);
        await investorFundstack.algodesk.transactionClient.waitForConfirmation(invTxId);
        const pendingTransactionInfo3 = await investorFundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
        console.log(pendingTransactionInfo3);

        await investorFundstack.algodesk.transactionClient.waitForBlock(fundParams.saleEndsAt);
        const {txId: claimTxId} = await investorFundstack.investorClaim(appId, investorKeys.addr);
        await investorFundstack.algodesk.transactionClient.waitForConfirmation(claimTxId);
        const pendingTransactionInfo4 = await investorFundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
        console.log(pendingTransactionInfo4);

        await fundstack.algodesk.transactionClient.waitForBlock(fundParams.saleEndsAt);
        const {txId: ownerClaimTxId} = await fundstack.ownerClaim(appId, false);
        await fundstack.algodesk.transactionClient.waitForConfirmation(ownerClaimTxId);
        const pendingTransactionInfo5 = await fundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
        console.log(pendingTransactionInfo5);
    }
    catch (e) {
        console.log(e);
    }
});

// test('fundEscrow', async () => {
//     try {
//         const {txId} = await fundstack.fundEscrow(416342833);
//         await fundstack.algodesk.transactionClient.waitForConfirmation(txId);
//         const pendingTransactionInfo = await fundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
//         console.log(pendingTransactionInfo);
//     }
//     catch (e) {
//         console.log(e);
//     }
// });

// test('get fund', async () => {
//     try {
//         const fund = await fundstack.get(416299837);
//         console.log(fund);
//     }
//     catch (e) {
//         console.log(e);
//     }
// });

// test('delete fund', async () => {
//     try {
//         const fund = await fundstack.delete(416381006);
//         console.log(fund);
//     }
//     catch (e) {
//         console.log(e);
//     }
// });


