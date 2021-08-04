'use strict';

import {AssetClient, NETWORKS, SIGNERS} from '../index';

test('adds 1 + 2 to equal 3', async () => {
    const assetClient = new AssetClient(NETWORKS.TESTNET, SIGNERS.WALLET);
    const assetDetails = await assetClient.get(408947);
    expect(assetDetails.index).toEqual(408947);
});
