export const token = {
    //'X-API-Key': PURE_STAKE_API_KEY
};
export const port = '';

export const networks = [
    {
        name: 'testnet',
        algod: 'https://api.testnet.algoexplorer.io',
        label: 'Testnet',
        explorer: 'https://testnet.algoexplorer.io',
        indexer: 'https://api.testnet.algoexplorer.io/idx2',
        algosigner: 'TestNet',
        port,
        token
    },
    {
        name: 'betanet',
        algod: 'https://api.betanet.algoexplorer.io',
        label: 'Betanet',
        indexer: 'https://api.betanet.algoexplorer.io/idx2',
        explorer: 'https://betanet.algoexplorer.io',
        algosigner: 'BetaNet',
        port,
        token
    },
    {
        name: 'mainnet',
        algod: 'https://api.algoexplorer.io',
        label: 'Mainnet',
        explorer: 'https://algoexplorer.io',
        indexer: 'https://api.algoexplorer.io/idx2',
        algosigner: 'MainNet',
        port,
        token
    }
];