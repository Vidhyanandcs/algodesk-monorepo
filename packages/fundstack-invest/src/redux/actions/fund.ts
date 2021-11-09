import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit'
import {handleException} from "./exception";
import fundstackSdk from "../../utils/fundstackSdk";
import {Fund} from "@algodesk/fundstack-sdk";
import {hideLoader, showLoader} from "./loader";
import {showSuccessModal} from "./successModal";
import {loadAccount} from "./account";


export interface FundDetails {
    loading: boolean,
    fund?: Fund,
    account: {
        registered: boolean
    }
}

const initialState: FundDetails = {
    loading: false,
    account: {
        registered: false
    }
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
    async (fundId: bigint | number, thunkAPI) => {
        const {dispatch, getState} = thunkAPI;
        try {
            const appState: any = getState();
            const {account} = appState;
            const {address} = account.information;
            dispatch(showLoader("Registering ..."));
            const txDetails = await fundstackSdk.fundstack.register(Number(fundId), address);
            dispatch(hideLoader());
            dispatch(showSuccessModal("Your registration is successful"));
            dispatch(loadAccount(address));
            return txDetails;
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

export const fundSlice = createSlice({
    name: 'fund',
    initialState,
    reducers: {
        setLoading: (state , action: PayloadAction<boolean>) => {
            state.loading = action.payload;
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
    },
});

export const {setLoading, resetFund} = fundSlice.actions
export default fundSlice.reducer