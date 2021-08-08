export const BLOCK_TIME: number = 4.5;

export interface NETWORKS {
    BETANET: string,
    TESTNET: string,
    MAINNET: string
}

export const NETWORKS: NETWORKS = {
    BETANET: 'betanet',
    TESTNET: 'testnet',
    MAINNET: 'mainnet'
}

export interface SIGNERS {
    WALLET: string,
    ALGO_SIGNER: string,
    LOGIC_SIG: string
}

export const SIGNERS: SIGNERS = {
    WALLET: 'wallet',
    ALGO_SIGNER: 'algo_signer',
    LOGIC_SIG: 'logic_sig'
}