export enum POOL_PHASE  {
    BEFORE_REGISTRATION = 1,
    DURING_REGISTRATION = 2,
    BEFORE_SALE = 3,
    DURING_SALE = 4,
    BEFORE_CLAIM = 5,
    DURING_CLAIM = 6,
    COMPLETED = 7
}

export enum POOL_OPERATIONS {
    CREATE_POOL = 'create_pool',
    PUBLISH = 'publish',
    INVEST = 'invest',
    INVESTOR_CLAIM = 'investor_claim',
    INVESTOR_WITHDRAW = 'investor_withdraw',
    OWNER_CLAIM = 'owner_claim',
    OWNER_WITHDRAW = 'owner_withdraw',
    REGISTER = 'register'
}

export enum PLATFORM_OPERATIONS {
    VALIDATE_POOL = 'validate_pool'
}

export const IPFS_SERVER = 'https://ipfs.io/ipfs/';
export const DEFAULT_POOL_LOGO = 'bafkreiayzu7fihhhqciisyd3bduxjb5abju73d4b6sw3pw4pash7h3vtxu';