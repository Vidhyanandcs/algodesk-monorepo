'use strict';

import {Account, mnemonicToSecretKey} from "algosdk";
import {testnet, WalletSigner} from "@algodesk/core";
import {Fundstack} from '../index';

test('api tests', async () => {
    const mnemonic = 'quality family fork daring skirt increase arena enhance famous marble bracket kingdom huge dash hedgehog ask sport legal able rain kidney abandon theme absent elephant';
    const keys: Account = mnemonicToSecretKey(mnemonic);

    const token = {"X-API-Key": '3jyPjXbQvf6E9LyEtbgKL7pKaN3qa0wW5QAecYOK'};
    testnet.setAlgodServer('https://testnet-algorand.api.purestake.io/ps2', token);
    testnet.setIndexerServer('https://testnet-algorand.api.purestake.io/idx2', token);

    const walletSigner = new WalletSigner(keys);

    const fundstack = new Fundstack(testnet, walletSigner);

    const fund = await fundstack.get(19716390);
    console.log(fund);
    expect(fund.id).toBe(19716390);

    const compiledEscrow = await fundstack.compileEscrow(fund);
    console.log(compiledEscrow);

});
