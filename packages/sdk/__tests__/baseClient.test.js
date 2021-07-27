'use strict';

import {AlgoDesk} from '@algodesk/sdk';

test('getChangingParams', async () => {
    const algodesk = new AlgoDesk('testnet');
    const params = await algodesk.applicationClient.getNetworkParams();
    const {genesisID} = params;
    expect(genesisID).toEqual('testnet-v1.0');
});