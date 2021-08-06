'use strict';

import {Algodesk, testnet, WalletSigner} from '@algodesk/sdk';
import {Account, mnemonicToSecretKey} from 'algosdk';

test('api tests', async () => {
    const mnemonic = 'quality family fork daring skirt increase arena enhance famous marble bracket kingdom huge dash hedgehog ask sport legal able rain kidney abandon theme absent elephant';
    const keys: Account = mnemonicToSecretKey(mnemonic);

    const token = {"X-API-Key": '3jyPjXbQvf6E9LyEtbgKL7pKaN3qa0wW5QAecYOK'};
    testnet.setAlgodServer('https://testnet-algorand.api.purestake.io/ps2', token);
    testnet.setIndexerServer('https://testnet-algorand.api.purestake.io/idx2', token);

    const walletSigner = new WalletSigner();
    walletSigner.setWallet(keys);

    const algodesk = new Algodesk(testnet, walletSigner);

    const appDetails = await algodesk.applicationClient.get(21431880);
    console.log(appDetails);
});
