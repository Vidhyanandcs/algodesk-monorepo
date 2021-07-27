'use strict';

import {BaseClient} from '@algodesk/sdk';

test('getChangingParams', async () => {
    const client = new BaseClient('testnet');
    const params = await client.getNetworkParams();
    const {genesisID} = params;
    expect(genesisID).toEqual('testnet-v1.0');
});