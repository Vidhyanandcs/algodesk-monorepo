import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fundstackSdk from "../../utils/fundstackSdk";
import {F_AccountActivity, Fund} from "@algodesk/fundstack-sdk";
import {hideLoader, showLoader} from "./loader";
import {showSuccessModal} from "./successModal";
import {loadAccount} from "./account";
import {isNumber} from "util";
import {showSnack} from "./snackbar";


export interface FundDetails {
    loading: boolean,
    fund?: Fund,
    account: {
        registered: boolean,
        invested: boolean,
        claimed: boolean,
        withdrawn: boolean,
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
        registered: false,
        invested: false,
        claimed: false,
        withdrawn: false,
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
            dispatch(setRegistration(id));
            dispatch(setInvestment(id));
            dispatch(setClaim(id));
            dispatch(setWithdraw(id));
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

export const register = createAsyncThunk(
    'fund/register',
    async (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;
            dispatch(showLoader("Registering ..."));
            const {txId} = await fundstackSdk.fundstack.register(fundId, address);
            dispatch(hideLoader());
            dispatch(showLoader("Waiting for confirmation ..."));
            await fundstackSdk.fundstack.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(setAction(''));
            dispatch(showSuccessModal("Your registration is successful"));
            dispatch(loadAccount(address));
            dispatch(loadFund(fundId));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const setRegistration = createAsyncThunk(
    'fund/setRegistration',
     (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                return fundstackSdk.fundstack.hasRegistered(account.information, fundId);
            }

            return false;
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const invest = createAsyncThunk(
    'fund/invest',
    async (data: any, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;

            const {amount, fund} = data;

            if (amount === undefined || amount === null || !isNumber(amount)) {
                dispatch(showSnack({
                    severity: 'error',
                    message: 'Invalid amount'
                }));
                return;
            }

            const minAllocation = fundstackSdk.fundstack.getMinAllocationInDecimals(fund);
            if (amount < minAllocation) {
                dispatch(showSnack({
                    severity: 'error',
                    message: 'Minimum allocation is ' + minAllocation
                }));
                return;
            }

            const maxAllocation = fundstackSdk.fundstack.getMaxAllocationInDecimals(fund);
            if (amount > maxAllocation) {
                dispatch(showSnack({
                    severity: 'error',
                    message: 'Maximum allocation is  ' + maxAllocation
                }));
                return;
            }

            const payableAmount = fundstackSdk.fundstack.calculatePayableAmount(amount, fund);

            dispatch(showLoader("Investing ..."));
            const {txId} = await fundstackSdk.fundstack.invest(fund.id, address, payableAmount);
            dispatch(hideLoader());
            dispatch(showLoader("Waiting for confirmation ..."));
            await fundstackSdk.fundstack.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(showSuccessModal("Your investment is successful"));
            dispatch(loadAccount(address));
            dispatch(loadFund(fund.id));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const setInvestment = createAsyncThunk(
    'fund/setInvestment',
    (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                return fundstackSdk.fundstack.hasInvested(account.information, fundId);
            }

            return false;
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const claimAssets = createAsyncThunk(
    'fund/claimAssets',
    async (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;
            dispatch(showLoader("Claiming assets ..."));
            const {txId} = await fundstackSdk.fundstack.investorClaim(fundId, address);
            dispatch(hideLoader());
            dispatch(showLoader("Waiting for confirmation ..."));
            await fundstackSdk.fundstack.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(setAction(''));
            dispatch(showSuccessModal("Your claim is successful"));
            dispatch(loadAccount(address));
            dispatch(loadFund(fundId));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const setClaim = createAsyncThunk(
    'fund/setClaim',
    (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                return fundstackSdk.fundstack.hasClaimed(account.information, fundId);
            }

            return false;
        }
        catch (e: any) {
            dispatch(handleException(e));
        }
    }
);

export const withdrawInvestment = createAsyncThunk(
    'fund/withdrawInvestment',
    async (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;
            dispatch(showLoader("withdrawing investment ..."));
            const {txId} = await fundstackSdk.fundstack.investorWithdraw(fundId, address);
            dispatch(hideLoader());
            dispatch(showLoader("Waiting for confirmation ..."));
            await fundstackSdk.fundstack.algodesk.transactionClient.waitForConfirmation(txId);
            dispatch(hideLoader());
            dispatch(setAction(''));
            dispatch(showSuccessModal("Your withdraw is successful"));
            dispatch(loadAccount(address));
            dispatch(loadFund(fundId));
            return txId;
        }
        catch (e: any) {
            dispatch(handleException(e));
            dispatch(hideLoader());
        }
    }
);

export const setWithdraw = createAsyncThunk(
    'fund/setWithdraw',
    (fundId: number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            if (account.loggedIn) {
                return fundstackSdk.fundstack.hasWithDrawn(account.information, fundId);
            }

            return false;
        }
        catch (e: any) {
            dispatch(handleException(e));
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
                return await fundstackSdk.fundstack.getAccountFundActivity(fundId, account.information.address);
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
        builder.addCase(setRegistration.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.registered = action.payload;
        });
        builder.addCase(setInvestment.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.invested = action.payload;
        });
        builder.addCase(setClaim.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.claimed = action.payload;
        });
        builder.addCase(setWithdraw.fulfilled, (state, action: PayloadAction<any>) => {
            state.account.withdrawn = action.payload;
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