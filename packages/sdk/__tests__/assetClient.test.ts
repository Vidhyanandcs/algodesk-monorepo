'use strict';

import {Algodesk, AssetClient, BaseSigner, NETWORKS, SIGNERS, WalletSigner} from '../index';
import {Account, mnemonicToSecretKey} from 'algosdk';

test('adds 1 + 2 to equal 3', async () => {
    const mnemonic = 'quality family fork daring skirt increase arena enhance famous marble bracket kingdom huge dash hedgehog ask sport legal able rain kidney abandon theme absent elephant';
    const keys: Account = mnemonicToSecretKey(mnemonic);


    const walletSigner = new WalletSigner();
    walletSigner.setWallet(keys);

    const algodesk = new Algodesk(NETWORKS.TESTNET, walletSigner);


    //const {txId} = await algodesk.assetClient.create(keys.addr, 'ABC', 'testing', undefined, 100, 0, undefined, false, keys.addr, keys.addr, keys.addr, keys.addr, undefined, undefined);
    const {txId} = await algodesk.assetClient.destroy(keys.addr, 21703443, 'deleting test', undefined);
    await algodesk.transactionClient.waitForConfirmation(txId);
    const txDetails = await algodesk.transactionClient.pendingTransactionInformation(txId);
    console.log(txDetails);
});
