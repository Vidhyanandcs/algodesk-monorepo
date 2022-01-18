import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fundstackSdk from "../../utils/fundstackSdk";
import {F_AccountActivity, F_CompanyDetails, Fund, F_DeployFund} from "@fundstack/sdk";
import {hideLoader, showLoader} from "./loader";
import {showSuccessModal} from "./successModal";
import {loadAccount} from "./account";
import {isNumber} from "@algodesk/core";


export interface FundDetails {
    loading: boolean,
    fund?: Fund,
    account: {
        activity: {
            loading: boolean,
            list: F_AccountActivity[]
        }
    },
    action: string
}

const initialState: FundDetails = {
    loading: false,
    account: {
        activity: {
            loading: false,
            list: []
        }
    },
    action: ''
}

export const loadFund = createAsyncThunk(
    'fund/loadFund',
    async (id: number, thunkAPI) => {
        const {dispatch} = thunkAPI;
        try {
            dispatch(resetFund());
            dispatch(setLoading(true));
            const fund = await fundstackSdk.fundstack.get(id);
            const fundInfo = JSON.parse(JSON.stringify(fund));
            dispatch(getAccountActivity(id));
            dispatch(setLoading(false));
            return fundInfo;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(setLoading(false));
        }
    }
);

export function getDiffInSeconds(d1, d2) {
    return (d1 - d2) / 1000;
}

export function getBlockByDate(date: Date, currentRound: number): number {
    const currentDateTime = new Date();
    const secDiff = getDiffInSeconds(date, currentDateTime);
    return currentRound + Math.abs(Math.round(secDiff/4.5));
}

export async function validateFundParams(deployParams: F_DeployFund, company: F_CompanyDetails): Promise<boolean> {
    console.log(deployParams);
    console.log(company);
    const {name, assetId, totalAllocation, minAllocation, maxAllocation, price, regStartsAt, regEndsAt, saleStartsAt, saleEndsAt} = deployParams;
    const {website, whitePaper, github, tokenomics, twitter} = company;

    if (name === undefined || name === null || name === '') {
        throw Error('Invalid name');
    }
    if (website === undefined || website === null || website === '') {
        throw Error('Invalid website');
    }
    if (whitePaper === undefined || whitePaper === null || whitePaper === '') {
        throw Error('Invalid whitePaper');
    }
    if (github === undefined || github === null || github === '') {
        throw Error('Invalid github');
    }
    if (tokenomics === undefined || tokenomics === null || tokenomics === '') {
        throw Error('Invalid tokenomics');
    }
    if (twitter === undefined || twitter === null || twitter === '') {
        throw Error('Invalid twitter');
    }

    if (assetId === undefined || assetId === null || !isNumber(assetId)) {
        throw Error('Invalid asset');
    }
    if (totalAllocation === undefined || totalAllocation === null || !isNumber(totalAllocation) || totalAllocation <= 0) {
        throw Error('Invalid totalAllocation');
    }
    if (minAllocation === undefined || minAllocation === null || !isNumber(minAllocation) || minAllocation <= 0) {
        throw Error('Invalid minAllocation');
    }
    if (maxAllocation === undefined || maxAllocation === null || !isNumber(maxAllocation) || maxAllocation <= 0) {
        throw Error('Invalid maxAllocation');
    }
    if (price === undefined || price === null || !isNumber(price)) {
        throw Error('Invalid price');
    }

    if (regStartsAt < 0) {
        throw Error('Registration start date cannot be in the past');
    }

    if (regStartsAt < 0) {
        throw Error('Registration start date cannot be in the past');
    }
    if (regEndsAt < 0) {
        throw Error('Registration end date cannot be in the past');
    }
    if (saleStartsAt < 0) {
        throw Error('Sale start date cannot be in the past');
    }
    if (saleEndsAt < 0) {
        throw Error('Sale end date cannot be in the past');
    }

    if (regEndsAt < regStartsAt) {
        throw Error('Registration end date should be greater that registration start date');
    }

    if (saleStartsAt < regEndsAt) {
        throw Error('Sale start date should be greater that registration end date');
    }

    if (saleEndsAt < saleStartsAt) {
        throw Error('Sale end date should be greater that sale start date');
    }

    return true;
}

export const deploy = createAsyncThunk(
    'fund/deploy',
    async (data: any, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;

            const deployParams: F_DeployFund = data.deployParams;
            const company: F_CompanyDetails = data.company;

            dispatch(showLoader("Validating ..."));
            await validateFundParams(deployParams, company);
            dispatch(hideLoader());

            dispatch(showLoader("Deploying ..."));
            const {txId} = await fundstackSdk.fundstack.deploy(deployParams, company);
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation ..."));
            await fundstackSdk.fundstack.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());

            dispatch(showSuccessModal("Deployment successful"));
            dispatch(loadAccount(address));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);


export const getAccountActivity = createAsyncThunk(
    'fund/getAccountActivity',
    async (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                dispatch(setActivityLoading(true));
                const list = await fundstackSdk.fundstack.getAccountFundActivity(fundId, account.information.address);
                return list.reverse();
            }
        }
        catch (e: any) {
            dispatch(setActivityLoading(false));
            dispatch(handleException(e));
        }
    }
);

export const fundSlice = createSlice({
    name: 'fund',
    initialState: {
        ...initialState
    },
    reducers: {
        setLoading: (state , action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setAction: (state , action: PayloadAction<string>) => {
            state.action = action.payload;
        },
        setActivityLoading: (state , action: PayloadAction<boolean>) => {
            state.account.activity.loading = action.payload;
        },
        resetFund: state => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(loadFund.fulfilled, (state, action: PayloadAction<any>) => {
            state.fund = action.payload;
        });
        builder.addCase(deploy.fulfilled, (state, action: PayloadAction<any>) => {

        });
        builder.addCase(getAccountActivity.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.activity = {
                loading: false,
                list: action.payload
            };
        });
    },
});

export const {setLoading, resetFund, setAction, setActivityLoading} = fundSlice.actions
export default fundSlice.reducer