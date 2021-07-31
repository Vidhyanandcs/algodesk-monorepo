'use strict';

import {FundStack} from '@algodesk/fundstack-sdk';

test('getFund', async () => {
    jest.setTimeout(15)
    const fundStack = new FundStack('testnet');
    const fund = await fundStack.get(19716390);
    console.log(fund);
});