'use strict';

import {Account, mnemonicToSecretKey} from "algosdk";
import {Algodesk, betanet, WalletSigner} from "@algodesk/core";
import {Fundstack} from '../index';
import {F_DeployFund} from "../src/types";

const mnemonic = 'fine hope logic together enough biology sock delay all suit badge awake suggest cook spread grab airport moment isolate fold immense busy wedding abstract rail';
const keys: Account = mnemonicToSecretKey(mnemonic);

const walletSigner = new WalletSigner(keys);
walletSigner.setWallet(keys);
const fundstack = new Fundstack(betanet, walletSigner);

// test('create fund', async () => {
//     const networkParams = await fundstack.algodesk.transactionClient.getSuggestedParams();
//
//     const fundParams: F_DeployFund = {
//         from: keys.addr,
//         assetId: 408239549,
//         maxAllocation: 100,
//         minAllocation: 10,
//         name: "Testing v1 fund",
//         regStartsAt: networkParams.lastRound + (4.5 * 1000),
//         regEndsAt: networkParams.lastRound + (4.5 * 2000),
//         saleStartsAt: networkParams.lastRound + (4.5 * 3000),
//         saleEndsAt: networkParams.lastRound + (4.5 * 4000),
//         swapRatio: 10,
//         totalAllocation: 1000
//     };
//
//     try {
//         const {txId} = await fundstack.deploy(fundParams);
//         await fundstack.algodesk.transactionClient.waitForConfirmation(txId);
//         const pendingTransactionInfo = await fundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
//         console.log(pendingTransactionInfo);
//     }
//     catch (e) {
//         console.log(e);
//     }
// });

test('fundEscrow', async () => {
    try {
        const {txId} = await fundstack.fundEscrow(408360454);
        await fundstack.algodesk.transactionClient.waitForConfirmation(txId);
        const pendingTransactionInfo = await fundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
        console.log(pendingTransactionInfo);
    }
    catch (e) {
        console.log(e);
    }
});


