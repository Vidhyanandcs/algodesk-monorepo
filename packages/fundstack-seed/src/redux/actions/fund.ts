import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fundstackSdk from "../../utils/fundstackSdk";
import {F_AccountActivity, F_CompanyDetails, Fund, F_DeployFund} from "@fundstack/sdk";
import {hideLoader, showLoader} from "./loader";
import {showSuccessModal} from "./successModal";
import {loadAccount} from "./account";


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

export const publish = createAsyncThunk(
    'fund/publish',
    async (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;


            dispatch(showLoader("Publishing ..."));
            const {txId} = await fundstackSdk.fundstack.publish(fundId);
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation ..."));
            await fundstackSdk.fundstack.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());

            dispatch(showSuccessModal("Published successfully"));
            dispatch(loadAccount(address));
            dispatch(loadFund(fundId));
            dispatch(setAction(''));

            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const withdraw = createAsyncThunk(
    'fund/withdraw',
    async (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;


            dispatch(showLoader("Withdrawing ..."));
            const {txId} = await fundstackSdk.fundstack.ownerWithdraw(fundId);
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation ..."));
            await fundstackSdk.fundstack.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());

            dispatch(showSuccessModal("Withdrawn successfully"));
            dispatch(loadAccount(address));
            dispatch(loadFund(fundId));
            dispatch(setAction(''));

            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const claim = createAsyncThunk(
    'fund/claim',
    async (data: any, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;


            dispatch(showLoader("Claiming funds ..."));
            const {txId} = await fundstackSdk.fundstack.ownerClaim(data.fundId, data.unsoldAssetAction);
            dispatch(hideLoader());

            dispatch(showLoader("Waiting for confirmation ..."));
            await fundstackSdk.fundstack.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());

            dispatch(showSuccessModal("Claimed successfully"));
            dispatch(loadAccount(address));
            dispatch(loadFund(data.fundId));
            dispatch(setAction(''));

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
        builder.addCase(publish.fulfilled, (state, action: PayloadAction<any>) => {

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