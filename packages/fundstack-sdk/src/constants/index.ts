export enum FUND_PHASE  {
    BEFORE_REGISTRATION = 1,
    DURING_REGISTRATION = 2,
    BEFORE_SALE = 3,
    DURING_SALE = 4,
    BEFORE_CLAIM = 5,
    DURING_CLAIM = 6,
    COMPLETED = 7
}

export enum FUND_OPERATIONS {
    DEPLOY_FUND = 'deploy_fund',
    PUBLISH = 'publish',
    INVEST = 'invest',
    INVESTOR_CLAIM = 'investor_claim',
    INVESTOR_WITHDRAW = 'investor_withdraw',
    OWNER_CLAIM = 'owner_claim',
    OWNER_WITHDRAW = 'owner_withdraw',
    REGISTER = 'register'
}

export const ESCROW_MIN_TOP_UP = 2;

export const REVENUE_APP_ID = 438565946;
export const REVENUE_PUBLISH_FEE = 1;
export enum REVENUE_OPERATIONS {
    VALIDATE_FUND = 'validate_fund'
}