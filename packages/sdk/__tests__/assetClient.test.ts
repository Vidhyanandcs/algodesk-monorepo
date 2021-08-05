'use strict';

import {AssetClient, BaseSigner, NETWORKS, SIGNERS, WalletSigner} from '../index';
import algosdk, {Account} from 'algosdk';
import {AccountClient} from "../src/clients/accountClient";

test('adds 1 + 2 to equal 3', async () => {
    const mnemonic = 'quality family fork daring skirt increase arena enhance famous marble bracket kingdom huge dash hedgehog ask sport legal able rain kidney abandon theme absent elephant';
    const keys: Account = algosdk.mnemonicToSecretKey(mnemonic);



    const assetClient = new AssetClient(NETWORKS.TESTNET, SIGNERS.WALLET);
    const accountClient = new AccountClient(NETWORKS.TESTNET, SIGNERS.WALLET);

    const wallet: Record<string, any> = await accountClient.getAccountInformation(keys.addr);
    wallet.sk = keys.sk;
    wallet.address = keys.addr;

    const walletSigner: BaseSigner = assetClient.getSigner();
    walletSigner.setWallet(wallet)

    const assetDetails = await assetClient.create(keys.addr, 'ABC', 'testing', undefined, 100, 0, undefined, false, keys.addr, keys.addr, keys.addr, keys.addr, undefined, undefined);
    console.log(assetDetails);
});
