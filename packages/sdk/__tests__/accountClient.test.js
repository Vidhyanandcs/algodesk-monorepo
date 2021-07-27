'use strict';

import {AlgoDesk} from '@algodesk/sdk';

test('getAccountInformation', async () => {
    const algodesk = new AlgoDesk('testnet');
    const accountDetails = await algodesk.accountClient.getAccountInformation('NXLRPYYTPAX6XM4C6XKQCCRWXYRQ4NRTESCU4TWIHF3FJ4FDCU5V5TXKRM');
    const {amount} = accountDetails;
    expect(amount).toEqual(18456000);
});