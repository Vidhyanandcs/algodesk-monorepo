'use strict';

import {AccountClient} from '@algodesk/sdk';

test('getAccountInformation', async () => {
    const client = new AccountClient('testnet');
    const accountDetails = await client.getAccountInformation('NXLRPYYTPAX6XM4C6XKQCCRWXYRQ4NRTESCU4TWIHF3FJ4FDCU5V5TXKRM');
    const {amount} = accountDetails;
    expect(amount).toEqual(18456000);
});