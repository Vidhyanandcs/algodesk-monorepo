'use strict';

import {Account, mnemonicToSecretKey} from "algosdk";
import {Algodesk, betanet, WalletSigner} from "@algodesk/core";
import {Fundstack} from '../index';
import {F_DeployFund} from "../src/types";

const mnemonic = 'quality family fork daring skirt increase arena enhance famous marble bracket kingdom huge dash hedgehog ask sport legal able rain kidney abandon theme absent elephant';
const keys: Account = mnemonicToSecretKey(mnemonic);

console.log(keys);
const walletSigner = new WalletSigner(keys);
walletSigner.setWallet(keys);

test('api tests', async () => {
    const fundstack = new Fundstack(betanet, walletSigner);

    const networkParams = await fundstack.algodesk.transactionClient.getSuggestedParams();

    console.log(networkParams);

    const fundParams: F_DeployFund = {
        address: keys.addr,
        assetId: 221682378,
        maxAllocation: 100,
        minAllocation: 10,
        name: "Testing v1 fund",
        regStartsAt: networkParams.lastRound + (4.5 * 1000),
        regEndsAt: networkParams.lastRound + (4.5 * 2000),
        saleStartsAt: networkParams.lastRound + (4.5 * 3000),
        saleEndsAt: networkParams.lastRound + (4.5 * 4000),
        swapRatio: 10,
        totalAllocation: 1000
    };

    try {
        const {txId} = await fundstack.deploy(fundParams);

        console.log(txId);

        const pendingTransactionInfo = await fundstack.algodesk.transactionClient.waitForConfirmation(txId);
        console.log(pendingTransactionInfo);

        const pendingTransactionInfo1 = await fundstack.algodesk.transactionClient.pendingTransactionInformation(txId);
        console.log(pendingTransactionInfo1);
    }
    catch (e) {
        console.log(e);
    }

});
